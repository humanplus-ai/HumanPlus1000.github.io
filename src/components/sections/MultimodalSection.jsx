import { useEffect, useRef } from 'react'
import { multimodal } from '../../data/site'
import Reveal from '../ui/Reveal'

/* ------------------------------------------------------------------ */
/* Modality column                                                     */
/* ------------------------------------------------------------------ */

/**
 * Video area — the dominant visual element of each column.
 * Renders a real looping clip as soon as `src` is set; until then it falls
 * back to a flat rectangle. No play button: the clip is data footage, so it
 * autoplays muted when it exists.
 */
function ModalityVideo({ src, label }) {
  const videoRef = useRef(null)

  /* Lazy autoplay: this clip is below the fold, so don't fetch it on first
     paint. An IntersectionObserver plays it once ~25% visible and pauses on
     the way out — same pattern as DemoSection. `preload="none"` keeps the
     browser from downloading until the observer fires. The muted assert is
     still required: some browsers drop React's `muted` prop on first mount
     and would block autoplay, freezing the clip on frame one. */
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
    <div className="relative aspect-video w-full overflow-hidden rounded-[8px]">
      {src ? (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="none"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-mute">
            {label}
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * One modality column — no panel, no background, no card.
 * Hierarchy comes from typography, spacing and hairlines only:
 *   ordinal + English heading → video → description → tags
 */
function ModalityColumn({ card, placeholderLabel }) {
  return (
    /* Shared glass skin, static (no `glass-card--lift`) — matches ACTIVITIES.
       The original blue hover wash is removed with the video frame below. */
    <div className="glass-card flex h-full flex-col">
      {/* Title — left-aligned, NO ordinal, a small section-level heading
          (not a giant numeral). Same size/weight for both cards. */}
      <h3 className="text-[17px] font-semibold leading-tight tracking-tight text-white/90">
        {card.title}
      </h3>

      {/* Description — under the title, above the video. Soft light grey,
          comfortable line-height. */}
      <p className="mt-2.5 text-[14px] leading-[1.6] font-normal text-white/55">{card.desc}</p>

      {/* Tags / category metadata — a lightweight label, no capsule, no border,
          no blue. A touch smaller, wider tracking, low-saturation grey. */}
      <p className="mt-2 text-[11px] font-mono tracking-[0.15em] text-white/40">{card.tags}</p>

      {/* Video — the visual anchor, below all the text. */}
      <div className="mt-4">
        <ModalityVideo src={card.videoSrc} label={placeholderLabel} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 04 — Multimodal Data                                                */
/* ------------------------------------------------------------------ */

export default function MultimodalSection() {
  return (
    <section className="relative py-[85px] md:py-[107px]">
      {/* id="dataset" — the nav "Dataset" link points at #dataset.
          Anchor is on the content wrapper so it skips the section's top
          padding; the navbar offset comes from html { scroll-padding-top }. */}
      <div id="dataset" className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10">
        {/* Small section label */}
        <Reveal className="text-xs font-mono tracking-[0.3em] text-mute">{multimodal.label}</Reveal>

        {/* Main title */}
        <Reveal
          as="h2"
          delay={1}
          className="mt-4 font-black tracking-tight leading-[1.2] text-[clamp(1.25rem,4vw,3rem)]"
        >
          {multimodal.title}
        </Reveal>

        {/* Description */}
        <Reveal delay={2} className="mt-6">
          <p className="max-w-xl text-base text-white/70">{multimodal.description}</p>
        </Reveal>

        {/* Two columns, 50/50 — hairline dividers sit in the middle of the gap
            so both columns keep exactly the same content width. */}
        <div className="mt-20 grid gap-14 md:gap-8 md:grid-cols-2">
          {multimodal.cards.map((card, i) => (
            <Reveal key={card.title} delay={i + 3} className="relative">
              {i > 0 && (
                <span
                  className="hidden md:block absolute top-0 bottom-0 -left-4 w-px bg-white/10"
                  aria-hidden="true"
                />
              )}
              <ModalityColumn card={card} placeholderLabel={multimodal.placeholderLabel} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
