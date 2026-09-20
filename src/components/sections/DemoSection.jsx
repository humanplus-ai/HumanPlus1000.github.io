import { useEffect, useRef } from 'react'
import { demo } from '../../data/site'
import Reveal from '../ui/Reveal'

/* ------------------------------------------------------------------ */
/* Video frame                                                         */
/* ------------------------------------------------------------------ */

/**
 * Shared frame shell — 16:9, same gradient/border/overflow treatment as
 * every other media frame on the page.
 *
 * On the main reel it stays inert: no group-hover tint, no focus ring, no
 * text selection, so pointing at the video cannot flash the brand blue.
 * (The old sample grid used to reuse this shell for its own cells; that grid
 * is gone, so this shell now has exactly one user.)
 */
const FRAME_CLASS =
  'relative aspect-video w-full bg-gradient-to-br from-ink2 to-ink3 border border-white/10 overflow-hidden select-none'

/**
 * Autoplaying demo clip.
 *
 * - `autoPlay` + `muted` + `playsInline` + `loop`, no native controls: the
 *   browser only allows gesture-free playback while muted, so muting is a
 *   hard requirement, not a stylistic choice.
 * - An IntersectionObserver plays the clip once the frame is ~25% visible
 *   and pauses it on the way out, so it never decodes off-screen. Re-entering
 *   the viewport fires the observer again and resumes playback.
 * - `muted` is asserted in the effect as well: some browsers drop React's
 *   `muted` prop on first mount, which would block autoplay and freeze the
 *   clip on frame one.
 */
function AutoplayVideo({ src, poster }) {
  const videoRef = useRef(null)

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
  }, [])

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      tabIndex={-1}
      className="h-full w-full object-cover select-none outline-none focus:outline-none"
    />
  )
}

/**
 * Fallback shown while `demo.videoSrc` is null. Kept exactly as it was,
 * including its hover treatment — the hover cleanup above targets the video
 * area only.
 */
function PlaceholderFrame({ label }) {
  return (
    <div className={`group ${FRAME_CLASS} transition-colors duration-300 hover:border-brandLine`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
        <span className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/20 flex items-center justify-center text-white/60 transition-colors duration-300 group-hover:border-brandLine group-hover:text-brand">
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 md:w-7 md:h-7 translate-x-[1px]"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
        </span>
        <span className="text-xs font-mono text-mute uppercase tracking-[0.3em] transition-colors duration-300 group-hover:text-brand/70">
          {label}
        </span>
      </div>

      {/* Brand hover wash — a flat 5% tint, no gradient and no glow */}
      <span
        className="pointer-events-none absolute inset-0 bg-brandSoft opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
    </div>
  )
}

function VideoFrame({ src, label, poster }) {
  if (!src) return <PlaceholderFrame label={label} />
  return (
    <div className={FRAME_CLASS}>
      <AutoplayVideo src={src} poster={poster} />
    </div>
  )
}

/**
 * English only. Restyled to match the Multimodal Data and Open Source
 * modules: small label → large two-word title → content. The video frame
 * and its logic are unchanged; only the header hierarchy, alignment,
 * spacing and typography were adjusted to the shared design language.
 */
export default function DemoSection() {
  return (
    <section className="relative py-32 md:py-40">
      {/* Anchor sits on the content wrapper, not on the <section>: the section's
          py-32/md:py-40 padding is invisible, so anchoring the section itself
          landed the heading far below the navbar. */}
      <div id="demo" className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10">
        {/* Small section label */}
        <Reveal className="text-xs font-mono tracking-[0.3em] text-mute">{demo.label}</Reveal>

        {/* Main title — the dominant visual element of this block */}
        <Reveal
          as="h2"
          delay={1}
          className="mt-4 font-black tracking-tight leading-[1.2] text-[clamp(1.25rem,4vw,3rem)]"
        >
          {demo.title}
        </Reveal>

        {/* One-line description — restrained, left-aligned */}
        <Reveal delay={2} className="mt-6">
          <p className="max-w-xl text-base text-white/70">{demo.description}</p>
        </Reveal>

        {/* Demo reel — full content width, 16:9, sits under the title.
            Autoplays (muted, looped, no controls) when scrolled into view.
            The 2 × 2 sample grid that used to follow it was removed: this
            module is now label → title → description → reel, nothing else. */}
        <Reveal delay={3} className="mt-16 md:mt-20">
          <VideoFrame src={demo.videoSrc} label={demo.placeholderLabel} poster={demo.posterSrc} />
        </Reveal>
      </div>
    </section>
  )
}
