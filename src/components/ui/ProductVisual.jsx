import { useEffect, useRef } from 'react'

/**
 * Product visual — holds whatever exists today:
 *   videoSrc  → muted + looped + inline clip, autoplayed when in view
 *   imageSrc  → still image
 *   neither   → a whisper-quiet placeholder ("PRODUCT IMAGE")
 *
 * Two deliberate framings (different from the dataset media blocks):
 *   - Placeholder → 4:3 reserved box, hairline border + faint dot grid, so
 *     the area stays legible while we wait for art.
 *   - Real asset  → the frame styling disappears completely. The product shot
 *     sits straight on the page background, centred, with no panel, no fill
 *     and no hover wash (a tint rectangle would show up behind a transparent
 *     PNG). No `overflow-hidden` either, so the hover scale can't clip the
 *     product's edges.
 *
 * Sizing: full column width, capped at 46vh, `object-contain`. The cap is what
 * keeps the band at 50–60vh — the glove asset is 0.59 portrait and would
 * otherwise be ~1000px tall. It also makes all three products read at a
 * consistent height, which matters more than a consistent width.
 */

const MEDIA_CLASS =
  'relative z-[1] w-full h-auto max-h-[42vh] md:max-h-[46vh] object-contain ' +
  'transition-transform duration-500 group-hover:scale-[1.03]'

export default function ProductVisual({ imageSrc, videoSrc, label, alt = '', halo = false }) {
  const videoRef = useRef(null)
  const hasAsset = Boolean(imageSrc || videoSrc)

  /* Same autoplay guard as the other media blocks: some browsers ignore
     React's `muted` prop on first mount and would block playback, leaving
     the clip frozen on frame one. */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true

    const play = () => {
      const played = video.play()
      if (played && typeof played.catch === 'function') played.catch(() => {})
    }

    if (typeof IntersectionObserver === 'undefined') {
      play()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play()
        else video.pause()
      },
      { threshold: 0.25 }
    )
    observer.observe(video)

    return () => observer.disconnect()
  }, [videoSrc])

  const frame = hasAsset
    ? 'group relative w-full flex items-center justify-center'
    : 'group relative w-full aspect-[4/3] overflow-hidden border border-white/5 transition-colors duration-500 hover:border-brandLine'

  return (
    <div className={frame}>
      {/* Dark-grey ground behind the shot — see `.product-halo`. Opt-in per
          product (`halo` in site.js) and only ever a soft radial: no edge,
          no panel. This is what keeps the black Vision-0 ring legible on the
          near-black page. */}
      {halo && (
        <span className="product-halo pointer-events-none absolute inset-0" aria-hidden="true" />
      )}

      {/* Placeholder-only texture — keeps the empty area readable without
          looking like a card. */}
      {!hasAsset && (
        <span className="dot-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      )}

      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          preload="none"
          className={MEDIA_CLASS}
        />
      ) : imageSrc ? (
        <img src={imageSrc} alt={alt} className={MEDIA_CLASS} />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center px-6">
          <span className="text-center text-[10px] font-mono uppercase tracking-[0.3em] text-white/25 transition-colors duration-300 group-hover:text-brand/70">
            {label}
          </span>
        </span>
      )}
    </div>
  )
}
