import { research } from '../../data/site'
import Reveal from '../ui/Reveal'

/* ------------------------------------------------------------------ */
/* Paper link — uppercase mono + arrow that nudges right on hover      */
/* ------------------------------------------------------------------ */

/**
 * One external link of a paper block.
 *
 * Deliberately not an `<a>` with a blue underline: on this page links are
 * small mono labels in upper case whose only hover feedback is a colour
 * shift to the brand blue and a 4px arrow slide. No underline, ever —
 * it is what keeps the module reading like a spec sheet rather than a
 * bibliography.
 */
function PaperLink({ link }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group/link inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] text-white/60 transition-colors duration-300 hover:text-brand"
    >
      <span>{link.label}</span>
      <span
        className="transition-transform duration-300 group-hover/link:translate-x-1"
        aria-hidden="true"
      >
        →
      </span>
    </a>
  )
}

/* ------------------------------------------------------------------ */
/* Header — title left, copy + More button flush to the right edge     */
/* ------------------------------------------------------------------ */

/**
 * The module's only FILLED brand-blue control, parked at the TOP-RIGHT of
 * the header while the title and its description stay exactly where they
 * were on the left. Everything else here is hairlines and low-contrast
 * mono, so the pill is what gives the header a second focal point.
 *
 * Deliberately restrained: no border, no glow, no gradient, no scale — the
 * hover is a half-step lighter fill plus the arrow's usual 4px slide.
 */
function MoreButton({ link }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group/more research-more-glass inline-flex shrink-0 items-center gap-2 rounded-full pl-6 pr-5 py-2.5 text-sm font-semibold text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-brandLine"
    >
      <span>{link.label}</span>
      <span
        className="transition-transform duration-300 group-hover/more:translate-x-[3px]"
        aria-hidden="true"
      >
        →
      </span>
    </a>
  )
}

/* ------------------------------------------------------------------ */
/* One paper — ordinal, title, venue stack, description, links         */
/* ------------------------------------------------------------------ */

/**
 * `h-full` + `flex-col` + `mt-auto` on the links is what makes three
 * blocks of unequal text length share one bottom edge: the grid stretches
 * every cell to the row height, then flex pushes the link row down. All three
 * teasers share one 16:9 frame, so adding them does not break that.
 *
 * The whole block is a `group`, but its only hover feedback is the ordinal
 * lifting from 25% to 45% brand blue — no fill, no border, no lift. Cards
 * are what this module is deliberately not.
 *
 * Meta row: ordinal on the left, optional award on the right, one flex
 * row. Its height is driven by the ordinal alone (the two-line award label
 * is ~28px, well under the numeral's 40–56px), so Paper 02's title starts
 * at exactly the same y as Papers 01 and 03 — the award can never push it
 * down.
 */
function Paper({ paper }) {
  return (
    <article className="group glass-card glass-card--lift flex h-full flex-col">
      {/* Meta row — fixed structure on every paper: number left, optional
          award right, nothing else. */}
      <div className="flex items-start justify-between gap-6">
        {/* Ordinal — large, low-contrast brand blue. It is a numeral, which
            is one of the few places this page spends the brand colour. */}
        <div className="text-[clamp(2.5rem,4vw,3.5rem)] font-black leading-none tracking-tight text-brand">
          {paper.index}
        </div>

        {/* Award — bare two-line mono label, no badge box, no border, no
            margin of its own. */}
        {paper.awards.length > 0 && (
          <div className="flex flex-col items-end gap-1 pt-1 text-right">
            {paper.awards.map((line) => (
              <span
                key={line}
                className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand"
              >
                {line}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Year / venue / conference — mono stack so each part can be read
          separately without inventing punctuation in the data. The WHOLE
          line is brand blue (`text-brand`), including the year and the `·` —
          it is the requirement for this module, and it is also the only
          colour the line ever needs, so there is no per-paper flag. */}
      <div className="mt-5 space-y-1">
        <p className="text-xs font-mono tracking-[0.15em] text-brand">
          {paper.year} · {paper.venue}
        </p>
        {paper.venueNote && (
          <p className="text-xs font-mono tracking-[0.15em] text-mute">{paper.venueNote}</p>
        )}
      </div>

      {/* Teaser — 16:9 because all three sources are 16:9 (1568×882,
          2310×1299, 1641×923), so `aspect-video` + `object-cover` neither
          crops nor squashes anything: the frame ratio IS the source ratio.
          Nothing else here — no card, no border, no shadow, just a 4px radius
          (the same rounding used by the module's other flat surfaces).
          `loading="lazy"` keeps three ~900kB files off the critical path. */}
      {paper.image && (
        <div className="mt-6 aspect-video w-full overflow-hidden rounded-[4px] bg-white/5">
          <img
            src={paper.image}
            alt={`${paper.venue} ${paper.year} — ${paper.title}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Full paper title — never abbreviated, wraps naturally */}
      <h3 className="mt-6 text-lg font-semibold leading-snug text-white md:text-xl">
        {paper.title}
      </h3>

      <p className="mt-6 text-sm leading-relaxed text-white/55">{paper.description}</p>

      {/* Links sit at the bottom so unequal blocks still line up */}
      <div className="mt-auto flex flex-wrap gap-x-8 gap-y-3 pt-10">
        {paper.links.map((link) => (
          <PaperLink key={link.url} link={link} />
        ))}
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/* Research                                                            */
/* ------------------------------------------------------------------ */

/**
 * English only. Three papers side by side on desktop, separated by
 * hairlines rather than cards.
 *
 * Column logic:
 *   1 col  → mobile, blocks stacked with a hairline between them
 *   2 cols → tablet, blocks are too narrow to hold a full title in
 *            threes, so the third wraps
 *   3 cols → desktop, with `lg:border-l` hairlines drawn between the
 *            columns (drawn per column instead of `divide-x` so the
 *            wrapping tablet rows never show a stray line)
 */
export default function ResearchSection() {
  const { papers } = research
  const last = papers.length - 1

  return (
    <section className="relative py-[85px] md:py-[107px]">
      {/* id="research" — the nav "Research" link points at #research.
          Anchor is on the content wrapper so the section's invisible top
          padding does not push the heading below the fold. (Same reason
          DownloadSection anchors its inner wrapper.) */}
      <div id="research" className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header — the title and its description keep the layout they have
            always had, stacked on the left. The only addition is the More
            pill: beside that stack on desktop, dropped below it on mobile
            (`flex-col` with `md:flex-row`), always flush to the right edge
            of the container so it reads as a corner action. */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-12">
          <div>
            {/* Main title */}
            <Reveal
              as="h2"
              className="font-black tracking-tight leading-[1.2] text-[clamp(1.25rem,4vw,3rem)]"
            >
              {research.title}
            </Reveal>

            {/* Description — unchanged position, measure and type */}
            <Reveal delay={1} className="mt-6">
              <p className="max-w-xl text-base text-white/70">{research.description}</p>
            </Reveal>
          </div>

          <Reveal delay={2} className="self-end md:self-auto">
            <MoreButton link={research.more} />
          </Reveal>
        </div>

        {/* Papers — 3 across on desktop, 2 on tablet, stacked on mobile */}
        <div className="mt-20 grid grid-cols-1 gap-y-14 md:grid-cols-2 md:gap-x-10 md:gap-y-16 lg:grid-cols-3 lg:gap-x-0 lg:gap-y-0">
          {papers.map((paper, i) => (
            <Reveal
              key={paper.index}
              delay={i + 1}
              className={[
                /* Mobile rule above every block but the first; it disappears
                   at `md` for whatever shares MD's first row (index 0–1) so
                   the two tablet columns line up at the top, and at `lg` for
                   everything, because there the column hairlines take over. */
                i === 0
                  ? ''
                  : i < 2
                    ? 'border-t border-white/10 pt-12 md:border-t-0 md:pt-0'
                    : 'border-t border-white/10 pt-12 lg:border-t-0 lg:pt-0',
                /* Horizontal breathing room only exists on the desktop row,
                   where the hairline actually runs between the columns. */
                i === 0 ? 'lg:pr-8' : '',
                i === last ? 'lg:border-l lg:border-white/10 lg:pl-8' : '',
                i > 0 && i < last ? 'lg:border-l lg:border-white/10 lg:pl-8 lg:pr-8' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <Paper paper={paper} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
