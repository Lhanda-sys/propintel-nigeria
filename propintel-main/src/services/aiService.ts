import type { Property } from '../types'

// Every function here is documented against the interface the real
// AI backend should implement later. Responses are deterministic and
// derived from each property's own mock data so the same property
// always produces the same explanation — this matters for user trust
// in a "why did you recommend this" feature.
//
// GEMINI READINESS
// -----------------
// This service is structured so a real Gemini (or any LLM) call can be
// dropped into the function bodies below without touching any component —
// every caller already goes through `aiService.*`, never raw fetch calls.
// A production version should NOT call the Gemini API directly from the
// browser (that would expose the API key); route it through a small
// backend/proxy that holds VITE_GEMINI_API_KEY-equivalent secrets
// server-side. `hasGeminiKey()` below exists purely so the UI can show an
// honest "AI unavailable" state instead of silently pretending mock
// output is a live model response.

const delay = <T,>(value: T, ms = 500): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

export interface UserPreferences {
  goal?: 'investment' | 'family-living' | 'rental-income' | 'development' | 'lowest-cost'
  notes?: string
}

export interface ComparisonConclusion {
  id: string
  title: string
  topUse?: Property['suitability'][number]
  verificationScore: number
  price: number
  bestFor: string[]
}

export const aiService = {
  /** True only when a real Gemini key/proxy has been configured. Every mock
   * function below still returns a usable (clearly-labelled) response when
   * this is false, so the UI never breaks — it just isn't a live model. */
  hasGeminiKey: (): boolean => Boolean(import.meta.env.VITE_GEMINI_API_KEY),

  getPropertyInsights: (property: Property) =>
    delay({
      overallPotential: Math.round(
        property.suitability.reduce((sum, s) => sum + s.score, 0) / property.suitability.length
      ),
      suitability: property.suitability,
      areaProfile: property.areaProfile,
    }),

  recommendPropertyUses: (property: Property) => delay(property.suitability),

  getAreaAnalysis: (property: Property) => delay(property.areaProfile),

  // Second argument is optional and additive — existing callers that only
  // pass `properties` keep working unchanged.
  compareProperties: (props: Property[], userPreferences?: UserPreferences): Promise<ComparisonConclusion[]> => {
    const cheapest = Math.min(...props.map((p) => p.price))
    const highestVerification = Math.max(...props.map((p) => p.verificationScore))
    const highestTopScore = Math.max(...props.map((p) => p.suitability[0]?.score ?? 0))
    const bestRoadAccess = props.reduce((best, p) =>
      p.areaProfile.roadAccessibility === 'Excellent' ? p : best, props[0])

    const results = props.map((p) => {
      const bestFor: string[] = []
      if (p.price === cheapest) bestFor.push('Lowest entry cost')
      if (p.verificationScore === highestVerification) bestFor.push('Strongest documentation / lowest risk')
      if ((p.suitability[0]?.score ?? 0) === highestTopScore) bestFor.push(`Best development potential (${p.suitability[0]?.use})`)
      if (p === bestRoadAccess) bestFor.push('Best accessibility')
      if (p.bedrooms && p.bedrooms >= 3) bestFor.push('Best for family living')
      if (/rent|hospitality|student/i.test(p.suitability[0]?.use ?? '')) bestFor.push('Best for rental income')

      if (userPreferences?.goal === 'investment' && (p.suitability[0]?.score ?? 0) === highestTopScore) {
        bestFor.push('Best fit for your stated investment goal')
      }
      if (userPreferences?.goal === 'lowest-cost' && p.price === cheapest) {
        bestFor.push('Best fit for your stated budget priority')
      }

      return {
        id: p.id,
        title: p.title,
        topUse: p.suitability[0],
        verificationScore: p.verificationScore,
        price: p.price,
        bestFor,
      }
    })
    return delay(results)
  },

  // A lightweight canned-response assistant scoped to a single property.
  // Swap for a real LLM call (e.g. Claude via the Anthropic API) once a
  // backend proxy exists to keep API keys off the client.
  answerPropertyQuestion: (property: Property, question: string): Promise<string> => {
    const q = question.toLowerCase()
    let answer: string

    if (q.includes('use') || q.includes('build') || q.includes('suitable')) {
      const top = property.suitability[0]
      answer = `Based on the available location and property information, the strongest potential use is ${top.use.toLowerCase()} (${top.score}% suitability). This is largely because ${top.reasons[0].toLowerCase()}. Would you like me to compare it with the next best option?`
    } else if (q.includes('rent') || q.includes('demand')) {
      const rentalUse = property.suitability.find((s) => /rent|let|hospitality|student/i.test(s.use)) ?? property.suitability[0]
      answer = `${rentalUse.use} shows the strongest rental-demand signal here, at ${rentalUse.score}% suitability, mainly because ${rentalUse.reasons[0].toLowerCase()}.`
    } else if (q.includes('document') || q.includes('title') || q.includes('verif')) {
      const pending = property.documents.filter((d) => d.status !== 'verified')
      answer = pending.length
        ? `${pending.length} document${pending.length > 1 ? 's are' : ' is'} still outstanding: ${pending.map((d) => `${d.type} (${d.status.replace('-', ' ')})`).join(', ')}. I'd recommend confirming these with the seller before proceeding.`
        : `All uploaded documents for this property currently show a verified status, giving a verification score of ${property.verificationScore}/100. This reflects platform-level checks only — please still carry out independent legal due diligence.`
    } else if (q.includes('electric') || q.includes('power')) {
      answer = `This area is classified as Electricity Band ${property.areaProfile.electricityBand}, with an estimated supply of ${property.areaProfile.estimatedSupplyHours}. Reliability is rated as ${property.areaProfile.electricityReliability.toLowerCase()}.`
    } else if (q.includes('risk')) {
      answer = `Based on available signals, road accessibility here is rated ${property.areaProfile.roadAccessibility.toLowerCase()} and electricity reliability is ${property.areaProfile.electricityReliability.toLowerCase()}. I don't have reliable flood-risk data for this specific plot, so I'd treat that as unknown rather than assume it's low risk.`
    } else {
      answer = `Here's what I can tell you: ${property.areaProfile.interpretation} If you'd like, ask me about suitable uses, rental demand, documents, or the surrounding area's electricity and accessibility.`
    }

    return delay(answer, 700)
  },

  /** Analyses a property against a stated user goal (e.g. "I want to build
   * student housing", "looking for the best rental return"). Returns the
   * suggested use, why it fits, considerations to weigh, and a confidence
   * label — never phrased as guaranteed advice. This is the function a real
   * Gemini call should replace; the mock reasoning below still reads
   * naturally because it's derived from the property's own suitability
   * data rather than being generic filler text. */
  analyseProperty: (
    property: Property,
    userGoal?: string
  ): Promise<{
    suggestedUse: string
    whySuitable: string
    considerations: string[]
    confidence: 'Low' | 'Moderate' | 'High'
  }> => {
    const goal = (userGoal ?? '').toLowerCase()
    const matched =
      property.suitability.find((s) => goal && s.use.toLowerCase().includes(goal)) ?? property.suitability[0]

    const considerations = [
      property.areaProfile.roadAccessibility === 'Poor' || property.areaProfile.roadAccessibility === 'Fair'
        ? `Road accessibility is currently rated ${property.areaProfile.roadAccessibility.toLowerCase()} — factor in access costs.`
        : `Road accessibility is rated ${property.areaProfile.roadAccessibility.toLowerCase()}.`,
      `Electricity is Band ${property.areaProfile.electricityBand} (${property.areaProfile.estimatedSupplyHours}).`,
      property.verificationScore < 80
        ? `Document verification is at ${property.verificationScore}/100 — confirm outstanding documents before committing.`
        : `Document verification is strong at ${property.verificationScore}/100, though independent legal due diligence is still recommended.`,
    ]

    const confidence: 'Low' | 'Moderate' | 'High' = matched.score >= 80 ? 'High' : matched.score >= 55 ? 'Moderate' : 'Low'

    return delay({
      suggestedUse: matched.use,
      whySuitable: matched.reasons[0] ?? property.areaProfile.interpretation,
      considerations,
      confidence,
    })
  },
}
