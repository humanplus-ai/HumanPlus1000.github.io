import { useEffect, useRef, useState } from 'react'
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
 * `SampleClip` below reuses this same shell and layers its own hover
 * treatment on top, which is why the two frames can never drift apart.
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

/* ------------------------------------------------------------------ */
/* Sample clip — click to play / pause                                  */
/* ------------------------------------------------------------------ */

/**
 * One clip of the 2 × 2 sample grid under the main reel.
 *
 * The laziest video on the page, on purpose — four autoplaying streams
 * would mean four decoders running at once:
 *
 * - No `src` and no `poster` at all until the frame comes within 200px of
 *   the viewport, so first paint downloads nothing for this grid.
 * - Once armed, `preload="none"` still keeps the bytes away; the poster
 *   (a still frame of the clip) holds the frame until the visitor clicks.
 *   Clicking is what actually starts the download.
 * - `muted` + `playsInline` + the muted assert in the effect: muting is
 *   what makes playback legal without a gesture, and some browsers drop
 *   React's `muted` prop on first mount.
 * - Click (or Enter / Space — the frame is a real <button>) toggles
 *   play/pause. The glyph follows the element's own play/pause events so
 *   it can never drift out of sync with the actual state.
 * - The main reel's autoplay + IntersectionObserver logic is untouched.
 */
function SampleClip({ sample }) {
  const videoRef = useRef(null)
  /* `armed` — close enough to the viewport to be allowed to load at all. */
  const [armed, setArmed] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (typeof IntersectionObserver === 'undefined') {
      setArmed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setArmed(true)
        observer.disconnect() // one-shot — never disarm, the clip stays playable
      },
      { rootMargin: '200px' }
    )
    observer.observe(video)

    return () => observer.disconnect()
  }, [])

  /* Muted assert — see the note in AutoplayVideo. */
  useEffect(() => {
    const video = videoRef.current
    if (video) video.muted = true
  }, [])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      const played = video.play()
      if (played && typeof played.catch === 'function') played.catch(() => {})
    } else {
      video.pause()
    }
  }

  return (
    /* `group` scopes the hover tint + caption highlight to this clip only */
    <div className="group flex flex-col">
      <button
        type="button"
        onClick={toggle}
        aria-label={`${sample.index} ${sample.title} — play / pause`}
        className={`${FRAME_CLASS} block cursor-pointer transition-colors duration-300 hover:border-brandLine focus:outline-none focus-visible:ring-1 focus-visible:ring-brandLine`}
      >
        <video
          ref={videoRef}
          src={armed ? sample.videoSrc : undefined}
          poster={armed ? sample.posterSrc : undefined}
          muted
          loop
          playsInline
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          /* Subtle premium hover: a 3% push-in and a touch more brightness.
             `overflow-hidden` on the shell keeps it clipped to the frame. */
          className="h-full w-full object-cover outline-none transition-[transform,filter] duration-500 group-hover:scale-[1.03] group-hover:brightness-[1.06]"
        />

        {/* Play / pause glyph — always visible while paused, and back on
            hover once playing so the click target stays discoverable. */}
        <span
          className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}
          aria-hidden="true"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white/80 transition-colors duration-300 group-hover:border-brandLine group-hover:text-brand md:h-14 md:w-14">
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true">
                <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 translate-x-[1px] md:h-5 md:w-5"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            )}
          </span>
        </span>

        {/* Brand hover wash — a flat 5% tint, no gradient and no glow */}
        <span
          className="pointer-events-none absolute inset-0 bg-brandSoft opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />
      </button>

      {/* Caption — ordinal only, in brand blue. `site.js` still carries a
          `title` per sample: it feeds the button's aria-label, it is simply
          not printed here. `mt-5` keeps the block short so the grid stays
          compact. */}
      <h3 className="mt-5 text-[11px] font-mono uppercase tracking-[0.25em] text-brand md:text-xs">
        {sample.index}
      </h3>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 02 — Demo / Live Capture                                            */
/* ------------------------------------------------------------------ */

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
            Autoplays (muted, looped, no controls) when scrolled into view. */}
        <Reveal delay={3} className="mt-16 md:mt-20">
          <VideoFrame src={demo.videoSrc} label={demo.placeholderLabel} poster={demo.posterSrc} />
        </Reveal>

        {/* Sample grid — 2 × 2 on desktop, single column on mobile, inside
            the same content wrapper so its edges line up with the reel.
            Every cell keeps the same 16:9 shell as the reel above. */}
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-14 md:gap-x-8 md:gap-y-14">
          {demo.samples.map((sample, i) => (
            <Reveal key={sample.index} delay={i + 1}>
              <SampleClip sample={sample} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
