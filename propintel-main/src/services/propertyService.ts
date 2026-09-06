import { properties, getPropertyBySlug, getFeaturedProperties, getSimilarProperties } from '../data/properties'
import type { Property, PropertyCategory } from '../types'

// This service currently reads from local mock data. Swap the function
// bodies below for real fetch()/GraphQL/Supabase calls later without
// touching any component that consumes this service.

const delay = <T,>(value: T, ms = 200): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

export interface PropertySearchFilters {
  query?: string
  category?: PropertyCategory
  state?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  verifiedOnly?: boolean
}

export const propertyService = {
  list: (): Promise<Property[]> => delay(properties),

  getFeatured: (): Promise<Property[]> => delay(getFeaturedProperties()),

  getBySlug: (slug: string): Promise<Property | undefined> => delay(getPropertyBySlug(slug)),

  getSimilar: (property: Property): Promise<Property[]> => delay(getSimilarProperties(property)),

  search: (filters: PropertySearchFilters): Promise<Property[]> => {
    let results = [...properties]
    if (filters.category) results = results.filter((p) => p.category === filters.category)
    if (filters.state) results = results.filter((p) => p.state === filters.state)
    if (filters.minPrice) results = results.filter((p) => p.price >= filters.minPrice!)
    if (filters.maxPrice) results = results.filter((p) => p.price <= filters.maxPrice!)
    if (filters.bedrooms) results = results.filter((p) => (p.bedrooms ?? 0) >= filters.bedrooms!)
    if (filters.verifiedOnly) results = results.filter((p) => p.verificationScore >= 80)
    if (filters.query) {
      const q = filters.query.toLowerCase()
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.neighbourhood.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q)
      )
    }
    return delay(results)
  },
}
