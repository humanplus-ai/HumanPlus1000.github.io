import { download } from '../../data/site'
import Reveal from '../ui/Reveal'

/* ------------------------------------------------------------------ */
/* 05 — Download / Open Source                                         */
/* ------------------------------------------------------------------ */

/**
 * English only. Anchored by the nav "Download" link (id="download").
 *
 * One wide, near-full-width panel: left content + right CTA.
 * No white block, no rounded card, no gradient — hierarchy is carried by
 * typography, a single hairline border, and generous whitespace, matching
 * the Multimodal Data module's restrained Research-Dataset aesthetic.
 */
export default function DownloadSection() {
  const { panel } = download
  const href = panel.cta.url ?? '#'

  return (
    <section className="relative py-[85px] md:py-[107px]">
      {/* id="download" — the nav "Download" link points at #download.
          Anchor is on the content wrapper: the section's top padding is
          invisible, so anchoring the section itself pushed the heading down
          to ~59% of the viewport. Navbar offset comes from
          html { scroll-padding-top }. */}
      <div id="download" className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10">
        {/* Small section label */}
        <Reveal className="text-xs font-mono tracking-[0.3em] text-mute">{download.label}</Reveal>

        {/* Main title */}
        <Reveal
          as="h2"
          delay={1}
          className="mt-4 font-black tracking-tight leading-[1.2] text-[clamp(1.25rem,4vw,3rem)]"
        >
          {download.title}
        </Reveal>

        {/* Wide panel — SAME frosted glass skin as RESEARCH / DATASET cards.
            Static (no `glass-card--lift`): the panel carries no hover. */}
        <Reveal delay={2} className="mt-16">
          <div className="glass-card flex flex-col gap-10 px-8 py-12 md:flex-row md:items-center md:justify-between md:px-16 md:py-20">
            {/* Left: content */}
            <div className="max-w-4xl">
              <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-white">
                {panel.heading}
              </h3>
              <p className="mt-6 text-lg leading-relaxed text-white/80">{panel.bodyPrimary}</p>
              <p className="mt-3 text-base leading-relaxed text-white/50">{panel.bodySecondary}</p>
              <p className="mt-8 text-[10px] font-mono uppercase tracking-[0.25em] text-mute">
                {panel.statsLine}
              </p>
            </div>

            {/* Right: CTA — blue glass capsule, reusing RESEARCH's
                `.research-more-glass` skin. Opens in a new tab. */}
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/cta research-more-glass inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white"
            >
              <span>{panel.cta.label}</span>
              <span className="transition-transform duration-300 ease-out group-hover/cta:translate-x-[3px]">
                ↗
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
