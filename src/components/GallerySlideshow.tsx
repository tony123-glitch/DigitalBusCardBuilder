'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'

interface GallerySlideshowProps {
  images: string[]
  isEditable: boolean
  themeColor: string
  onAddImage: () => void
  onRemoveImage: (url: string) => void
}

export default function GallerySlideshow({
  images,
  isEditable,
  themeColor,
  onAddImage,
  onRemoveImage,
}: GallerySlideshowProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir)
    setCurrent(idx)
  }, [])

  const next = useCallback(() => {
    if (images.length < 2) return
    goTo((current + 1) % images.length, 1)
  }, [current, images.length, goTo])

  const prev = useCallback(() => {
    if (images.length < 2) return
    goTo((current - 1 + images.length) % images.length, -1)
  }, [current, images.length, goTo])

  // Auto-advance every 3 seconds
  useEffect(() => {
    if (images.length < 2) return
    timerRef.current = setTimeout(next, 3000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [current, images.length, next])

  // Reset slide index if images change
  useEffect(() => {
    setCurrent(prev => Math.min(prev, Math.max(images.length - 1, 0)))
  }, [images.length])

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="pt-6 pb-2"
    >
      {/* Section Header */}
      <div className="flex items-center justify-center gap-2 mb-5">
        <div className="h-px flex-1 bg-white/[0.08]" />
        <p className="text-xs font-bold text-white uppercase tracking-[0.25em] px-3">Gallery</p>
        <div className="h-px flex-1 bg-white/[0.08]" />
      </div>

      {/* Slideshow */}
      {images.length > 0 ? (
        <div className="space-y-4">
          {/* Slide Container */}
          <div className="relative w-full rounded-3xl overflow-hidden bg-white/[0.04] border border-white/[0.08]" style={{ aspectRatio: '16/9' }}>
            <AnimatePresence custom={direction} mode="popLayout">
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'tween', duration: 0.45, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <img
                  src={images[current]}
                  alt={`Slide ${current + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                {/* Remove button in edit mode */}
                {isEditable && (
                  <button
                    onClick={() => onRemoveImage(images[current])}
                    className="absolute top-3 right-3 bg-black/60 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors backdrop-blur-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Slide counter badge */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wider">
                    {current + 1} / {images.length}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Arrow Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" strokeWidth={2} />
                </button>
              </>
            )}
          </div>

          {/* Dot Indicators */}
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > current ? 1 : -1)}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === current ? '20px' : '6px',
                    height: '6px',
                    backgroundColor: i === current ? themeColor : 'rgba(255,255,255,0.25)',
                  }}
                />
              ))}
            </div>
          )}

          {/* Add More button in edit mode */}
          {isEditable && (
            <button
              onClick={onAddImage}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 text-white/50 hover:text-white text-xs font-semibold uppercase tracking-widest transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add Another Image
            </button>
          )}
        </div>
      ) : isEditable ? (
        <button
          onClick={onAddImage}
          className="w-full flex flex-col items-center justify-center gap-3 py-10 rounded-3xl border border-dashed border-white/15 hover:border-white/30 hover:bg-white/5 text-white transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all">
            <Plus className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-white/60 group-hover:text-white transition-colors">Add Gallery Images</p>
            <p className="text-[11px] text-white/30 mt-1">Banners, photos, promotions</p>
          </div>
        </button>
      ) : null}
    </motion.div>
  )
}
