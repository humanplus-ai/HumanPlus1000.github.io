import { hero } from '../../data/site'
import DotGrid from '../ui/DotGrid'
import Reveal from '../ui/Reveal'
import StatBlock from '../ui/StatBlock'

/* ------------------------------------------------------------------ */
/* 01 — Cover / Hero                                                   */
/* ------------------------------------------------------------------ */

/**
 * The cover is a static still (no video): it runs full-bleed behind the copy
 * with `object-cover` and keeps its native colour and brightness. No autoplay,
 * no muted/loop/playsInline, and no IntersectionObserver — the image is just a
 * background layer.
 */
const COVER_MEDIA_CLASS = 'h-full w-full object-cover'

/**
 * Readability over the still comes from a restrained drop shadow on the copy
 * — not from darkening the image. No glow, no gradient plate, no glass panel.
 */
const COPY_SHADOW =
  '[text-shadow:0_2px_24px_rgba(0,0,0,0.55),0_1px_4px_rgba(0,0,0,0.4)]'

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background texture — kept only as a faint fallback behind the still. */}
      <DotGrid noise />

      {/* Cover still — full-bleed behind the copy (z-0). Static image, no
          video, no autoplay, no IntersectionObserver. width/height 100% +
          object-cover come from COVER_MEDIA_CLASS so it fills the hero. */}
      {hero.imageSrc && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <img
            src={hero.imageSrc}
            alt=""
            className={COVER_MEDIA_CLASS}
          />
        </div>
      )}

      {/* Single readability scrim — ONE overlay layer only (no second stacked
          mask). It carries a top-to-bottom black fade (navbar / headline
          legibility, fully transparent by the lower half) plus edge feathering
          that melts the still into the black page on the left/right and bottom
          so there is no hard rectangle edge. All gradients live on this one
          element's `background`, so nothing is layered on top of anything else.
          Layer order: still (z-0) → scrim (z-[1]) → copy (z-10). Decorative +
          click-through. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,0) 75%), ' +
            'linear-gradient(to right, #0a0a0a 0%, rgba(10,10,10,0) 9%, rgba(10,10,10,0) 91%, #0a0a0a 100%), ' +
            'linear-gradient(to bottom, rgba(10,10,10,0) 58%, rgba(10,10,10,0.9) 100%)',
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

        {/* Title — single line "HumanPlus-1000" with the headline styling.
            The "1000" stays in the brand accent; nothing else is highlighted. */}
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
        </Reveal>

        {/* Subtitle — one unified two-line text block. Both rows share the
            same font, size, weight and line spacing (site's standard sans
            body font, regular) and are centred as a single cohesive subtitle.
            A hard <br/> separates the two rows and `whitespace-nowrap` forbids
            any internal re-wrap, so the long second row stays on exactly one
            line (no third row). The wider max-width (max-w-6xl) gives the
            second row room to fit on one line at desktop widths. */}
        <Reveal
          as="p"
          delay={2}
          className={`text-center mt-8 text-base md:text-xl text-white/80 max-w-6xl mx-auto leading-relaxed font-normal whitespace-nowrap ${COPY_SHADOW}`}
        >
          {hero.subtitle[0]}
          <br />
          {hero.subtitle[1]}
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
