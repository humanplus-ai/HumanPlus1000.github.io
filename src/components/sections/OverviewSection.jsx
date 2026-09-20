import { useRef, useState } from 'react'
import { overview } from '../../data/site'
import Reveal from '../ui/Reveal'

/* ------------------------------------------------------------------ */
/* Body copy                                                           */
/* ------------------------------------------------------------------ */

/**
 * One paragraph of body copy — plain prose, no bold fragments.
 * Max width lives on the wrapper so every paragraph shares one measure.
 */
function Paragraph({ children }) {
  return <p className="text-base leading-relaxed text-white/70">{children}</p>
}

/* ------------------------------------------------------------------ */
/* Image frame                                                         */
/* ------------------------------------------------------------------ */

/**
 * 16:9 frame that holds the overview media.
 *
 * `aspect-video` (16 / 9) + `object-contain`: the clip is shown whole —
 * never cropped by `cover`, never stretched. The frame keeps 16:9 at every
 * breakpoint because the ratio is on the container, so the height simply
 * follows the responsive width.
 *
 * Renders a real <video> when `videoSrc` is set, otherwise a still <img>
 * when `src` is set, otherwise a flat placeholder rectangle. Swapping the
 * asset needs no layout change — only a path in site.js.
 *
 * Audio: the clip plays WITH sound, so it deliberately does not autoplay —
 * every browser blocks unmuted autoplay, and forcing it by flipping `muted`
 * back on would defeat the point of this clip. Instead the frame shows the
 * poster plus a play button; `start()` runs inside the click handler, so the
 * gesture that begins playback is also the gesture that unlocks audio.
 * Native controls appear once it starts, which is what gives the viewer
 * pause and volume.
 */
function ImageFrame({ src, videoSrc, label }) {
  const videoRef = useRef(null)
  /* Hidden as soon as the first `play` event fires, whatever started it. */
  const [started, setStarted] = useState(false)

  const start = () => {
    const v = videoRef.current
    if (!v) return
    /* No `v.muted = true` here — that is the whole point of this module. */
    const p = v.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  }

  return (
    <div className="group relative aspect-video w-full bg-gradient-to-br from-ink2 to-ink3 border border-white/10 overflow-hidden transition-colors duration-300 hover:border-brandLine">
      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={src || undefined}
          loop
          playsInline
          /* Controls only after the first play: before that the frame should
             read as a poster, not as a media player. */
          controls={started}
          onPlay={() => setStarted(true)}
          preload="none"
          /* contain, not cover — the whole 16:9 frame of the clip must be
             visible; cover would crop the top and bottom off. */
          className="w-full h-full object-contain"
        />
      ) : src ? (
        <img src={src} alt="" className="w-full h-full object-contain" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-mono text-mute uppercase tracking-[0.3em] transition-colors duration-300 group-hover:text-brand/70">
            {label}
          </span>
        </div>
      )}

      {/* Poster-state play affordance — a hairline circle and a triangle,
          the same vocabulary as the site's other placeholder glyphs. Gone
          the moment playback starts. */}
      {videoSrc && !started && (
        <button
          type="button"
          onClick={start}
          aria-label="Play the HumanPlus-1000 overview video with sound"
          className="absolute inset-0 flex items-center justify-center focus:outline-none focus-visible:ring-1 focus-visible:ring-brandLine"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors duration-300 group-hover:border-brandLine group-hover:text-brand md:h-20 md:w-20">
            <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-[2px] md:h-7 md:w-7" aria-hidden="true">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          </span>
        </button>
      )}

      {/* Brand hover wash — a flat 5% tint, no gradient and no glow */}
      <span
        className="pointer-events-none absolute inset-0 bg-brandSoft opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 03 — Overview                                                       */
/* ------------------------------------------------------------------ */

export default function OverviewSection() {
  return (
    <section className="relative py-[85px] md:py-[107px]">
      <div id="overview" className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid gap-12 lg:gap-16 items-center md:grid-cols-2 lg:grid-cols-[1.15fr_1fr]">
          {/* Left — copy */}
          <div>
            <Reveal className="text-xs font-mono text-mute uppercase tracking-[0.3em]">
              {overview.label}
            </Reveal>

            {/* Title — same H2 scale as the DEMO section title */}
            <Reveal
              as="h2"
              delay={1}
              className="mt-4 font-black tracking-tight leading-[1.2] text-[clamp(1.25rem,4vw,3rem)]"
            >
              {overview.title}
            </Reveal>

            {/* Body — max width keeps the reading rhythm comfortable */}
            <Reveal delay={2} className="mt-8 space-y-6 max-w-xl">
              {overview.body.map((text, i) => (
                <Paragraph key={i}>{text}</Paragraph>
              ))}
            </Reveal>
          </div>

          {/* Right — media (video or image) */}
          <Reveal delay={3}>
            <ImageFrame
              src={overview.imageSrc}
              videoSrc={overview.videoSrc}
              label={overview.placeholderLabel}
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
