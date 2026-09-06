import { useState } from 'react'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'

export default function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  const next = () => setActive((v) => (v + 1) % images.length)
  const prev = () => setActive((v) => (v - 1 + images.length) % images.length)

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-stone-light sm:aspect-[16/9]">
        <img src={images[active]} alt={`${title} — photo ${active + 1}`} className="h-full w-full object-cover" />
        <button
          onClick={() => setFullscreen(true)}
          className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1.5 text-xs font-medium text-parchment"
        >
          <Expand className="h-3.5 w-3.5" strokeWidth={1.75} />
          {active + 1} / {images.length}
        </button>
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-ink transition-colors hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-ink transition-colors hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-2 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              className={`aspect-[4/3] overflow-hidden rounded ${i === active ? 'ring-2 ring-ochre-dark' : 'opacity-80 hover:opacity-100'}`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {fullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4">
          <button
            onClick={() => setFullscreen(false)}
            aria-label="Close fullscreen gallery"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-parchment hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <button onClick={prev} aria-label="Previous photo" className="absolute left-4 rounded-full bg-white/10 p-2 text-parchment hover:bg-white/20">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <img src={images[active]} alt={`${title} — photo ${active + 1}`} className="max-h-[85vh] max-w-full rounded object-contain" />
          <button onClick={next} aria-label="Next photo" className="absolute right-4 rounded-full bg-white/10 p-2 text-parchment hover:bg-white/20">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  )
}
