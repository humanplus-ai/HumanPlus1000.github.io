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

  /* Same guard as Hero/DEMO: browsers only autoplay muted video, and some
     drop React's `muted` prop on first mount — assert it and kick playback
     off, otherwise the clip would freeze on frame one. */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    const played = video.play()
    if (played && typeof played.catch === 'function') played.catch(() => {})
  }, [])

  return (
    <div className="relative aspect-video w-full bg-gradient-to-br from-ink2 to-ink3 border border-white/10 overflow-hidden transition-colors duration-300 group-hover:border-brandLine">
      {src ? (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-mute transition-colors duration-300 group-hover:text-brand/70">
            {label}
          </span>
        </div>
      )}

      {/* Brand hover wash — a flat 5% tint, no gradient and no glow */}
      <span
        className="pointer-events-none absolute inset-0 bg-brandSoft opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
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
    /* `group` scopes the hover tint to this column only */
    <div className="group flex flex-col">
      {/* Ordinal + English name — the column heading.
          Only the ordinal number carries the brand colour; the title stays white. */}
      <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-white">
        <span className="text-brand">{card.index}</span> / {card.title}
      </h3>

      {/* Video */}
      <div className="mt-8">
        <ModalityVideo src={card.videoSrc} label={placeholderLabel} />
      </div>

      {/* Description */}
      <p className="mt-6 text-sm leading-relaxed text-white/60">{card.desc}</p>

      {/* Tags */}
      <p className="mt-6 text-[10px] font-mono uppercase tracking-widest text-mute">{card.tags}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 04 — Multimodal Data                                                */
/* ------------------------------------------------------------------ */

export default function MultimodalSection() {
  return (
    <section className="relative py-32 md:py-40">
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
