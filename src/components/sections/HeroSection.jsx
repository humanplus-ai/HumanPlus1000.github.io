import { useEffect, useRef } from 'react'
import { hero } from '../../data/site'
import DotGrid from '../ui/DotGrid'
import Reveal from '../ui/Reveal'
import StatBlock from '../ui/StatBlock'

/* ------------------------------------------------------------------ */
/* 01 — Cover / Hero                                                   */
/* ------------------------------------------------------------------ */

/**
 * The cover media now runs full-bleed behind the copy: no scrim, no dimming
 * layer, no card. `object-cover` fills the section on every aspect ratio and
 * the clip keeps its native colour, brightness and detail.
 *
 * The only remaining treatment is a barely-there fade across the last 8% at
 * the bottom, so the frame melts into the black page below instead of ending
 * on a hard rectangle edge. It is a mask on the media element itself — never
 * an overlay on top of it — and it never reads as a dark蒙版.
 */
const COVER_MEDIA_CLASS = 'h-full w-full object-cover'

const COVER_EDGE_FADE = {
  WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 92%, rgba(0,0,0,0.9) 100%)',
  maskImage: 'linear-gradient(to bottom, #000 0%, #000 92%, rgba(0,0,0,0.9) 100%)',
}

/**
 * Readability over the (now undimmed) footage comes from a restrained drop
 * shadow on the copy — not from darkening the video. No glow, no gradient
 * plate, no glass panel behind the text.
 */
const COPY_SHADOW =
  '[text-shadow:0_2px_24px_rgba(0,0,0,0.55),0_1px_4px_rgba(0,0,0,0.4)]'

export default function HeroSection() {
  const videoRef = useRef(null)

  /* Browsers only autoplay muted video. React sets `muted` as a property,
     but some browsers drop it on first mount, so assert it once and kick
     off playback — otherwise the hero would freeze on frame one. */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    const played = video.play()
    if (played && typeof played.catch === 'function') played.catch(() => {})
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background texture — kept only as a fallback if the clip is missing;
          the vignette is gone, it would have been a black wash over the
          footage. */}
      <DotGrid noise />

      {/* Cover media — full-bleed behind the copy, z-0 under the content
          (z-10). No scrim, no opacity dimming, no card frame: the clip is
          the visual, the type sits on top of it. Autoplay/muted/loop/inline
          behaviour is unchanged. */}
      {(hero.videoSrc || hero.imageSrc) && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          {hero.videoSrc ? (
            <video
              ref={videoRef}
              src={hero.videoSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              tabIndex={-1}
              className={COVER_MEDIA_CLASS}
              style={COVER_EDGE_FADE}
            />
          ) : (
            <img
              src={hero.imageSrc}
              alt=""
              className={COVER_MEDIA_CLASS}
              style={COVER_EDGE_FADE}
            />
          )}
        </div>
      )}

      {/* Top scrim — soft vertical fade so the fixed navbar melts into the
          footage instead of sitting on a hard seam. Near-black behind the
          bar, gone by 55% of the hero height, so the lower half of the clip
          keeps its original brightness. Layer order: video (z-0) → scrim
          (z-[1]) → copy (z-10). Purely decorative and click-through. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 12%, rgba(0,0,0,0.55) 28%, rgba(0,0,0,0.2) 42%, rgba(0,0,0,0) 55%)',
        }}
      />

      {/* Content — nudged upward so the headline sits in the upper-middle of
          the hero, leaving room for the cover image and the stats card below.
          The offset is a transform, so the centred layout is untouched. */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-12 -translate-y-10 md:-translate-y-14">
        {/* Pre-title pill */}
        <Reveal className="text-center mb-6">
          <span
            className={`inline-flex items-center gap-2 text-xs font-mono text-mute uppercase tracking-[0.3em] border border-white/10 rounded-full px-4 py-2 ${COPY_SHADOW}`}
          >
            {/* Live status dot — one of the few always-on brand accents */}
            <span className="w-1.5 h-1.5 bg-brand rounded-full" />
            {hero.pretitle}
          </span>
        </Reveal>

        {/* Title — two lines.
            The ceiling is lower than a single-line title because line 2
            ("Embodied Motion Dataset") is the widest row. */}
        <Reveal
          as="h1"
          delay={1}
          className={`text-center font-black tracking-tight leading-[1.2] text-[clamp(1.25rem,6.2vw,5.625rem)] ${COPY_SHADOW}`}
        >
          <span className="block whitespace-nowrap">
            {hero.title.line1.pre}
            {/* "1000" — the brand highlight inside the headline */}
            <span className="text-brand">{hero.title.line1.accent}</span>
            {hero.title.line1.post}
          </span>
          <span className="block whitespace-nowrap">{hero.title.line2}</span>
        </Reveal>

        {/* Subtitle */}
        <Reveal
          as="p"
          delay={2}
		  className={`text-center mt-8 text-lg md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-times ${COPY_SHADOW}`}

        >
          {hero.subtitle.map((part, i) =>
            part.strong ? (
              <span key={i} className="text-white">
                {part.text}
              </span>
            ) : (
              <span key={i}>{part.text}</span>
            )
          )}
        </Reveal>

        {/* Stats card — frosted silver panel floating over the cover image.
            The 1px grid gap shows the shell's white/10 background, which
            reads as a hairline divider between the four figures. */}
        <Reveal
          delay={3}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 max-w-4xl mx-auto overflow-hidden rounded-2xl border border-white/15 backdrop-blur-lg shadow-[0_10px_40px_-12px_rgba(0,0,0,0.65)]"
        >
          {hero.stats.map((stat) => (
            <StatBlock key={stat.label} {...stat} />
          ))}
        </Reveal>
      </div>
    </section>
  )
}
