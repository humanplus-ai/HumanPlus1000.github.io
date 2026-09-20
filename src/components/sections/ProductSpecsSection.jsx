import { productSpecs } from '../../data/site'
import Reveal from '../ui/Reveal'

/**
 * TECHNICAL SPECIFICATIONS — two independent dark-grey spec panels.
 *
 * Visual rules (brief §1–§6):
 *   - every piece of text INSIDE the tables is WHITE: captions, labels and
 *     values alike. Brand blue survives ONLY on the `01` / `02` ordinals in
 *     the table titles — never on parameter content.
 *   - each product gets its OWN panel: bg #1A1A1A, 4px radius (matches the
 *     site's image/video rounding), no shadow, no gradient, no white border.
 *   - rows are ruled by a 1px dark-grey hairline (#333) — quiet, never
 *     bright white, reads like a premium hardware spec sheet.
 *   - the two panels stack (space-y), never side by side: Vision-0's long
 *     names need the full column width.
 */

/* One grid template shared by the caption row and every value row — keeping
   them identical is what makes the two columns line up down the table.
   `minmax(0, …)` lets long cell text WRAP instead of forcing the grid wider
   than the panel (a plain `1fr` would not). */
const ROW_GRID =
  'grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-x-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-x-12'

/* Hairline colour — dark grey on the #1A1A1A panel, never white, never
   bright. A 1px rule at #333 reads as a quiet hardware spec divider. */
const HAIR = 'border-[#333333]'

/* ------------------------------------------------------------------ */
/* One parameter — label / value pair separated by a hairline          */
/* ------------------------------------------------------------------ */

/**
 * A `<dl>` row: `<dt>` is the specification, `<dd>` its value.
 * Both are white — the data never carries colour into the table body.
 */
function SpecRow({ row }) {
  return (
    <div className={`${ROW_GRID} ${HAIR} border-b py-4 md:py-5`}>
      <dt className="text-sm leading-relaxed text-white md:text-[0.95rem]">{row.label}</dt>
      <dd className="text-sm leading-relaxed text-white md:text-[0.95rem]">{row.value}</dd>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* One product's panel — ordinal heading + dark-grey spec sheet        */
/* ------------------------------------------------------------------ */

/**
 * `01 | MOTION-0`: the ordinal is brand blue, the name white, and the whole
 * heading is deliberately smaller than the module title. The table below it
 * lives inside its OWN dark-grey panel — a separate unit from the other
 * product's panel.
 */
function SpecTable({ table, delay, columns }) {
  return (
    <Reveal delay={delay}>
      <h3 className="text-xl font-bold tracking-tight text-white md:text-2xl">
        <span className="text-brand">{table.index}</span>
        <span> | {table.name}</span>
      </h3>

      {/* Independent dark-grey panel — one per product. Flat, rounded, no
          frame, no shadow, no gradient. The hairlines are the only rule. */}
      <div className="mt-6 rounded-[4px] bg-[#1A1A1A] px-6 py-2 md:px-8 md:py-3">
        <dl>
          {/* Caption row — mono, uppercase, tracked out, white, ruled top
              and bottom so the panel reads as one closed block. */}
          <div
            className={`${ROW_GRID} ${HAIR} border-y py-3 text-[11px] font-mono uppercase tracking-[0.25em] text-white`}
          >
            <div>{columns.specification}</div>
            <div>{columns.details}</div>
          </div>

          {table.rows.map((row) => (
            <SpecRow key={row.label} row={row} />
          ))}
        </dl>
      </div>
    </Reveal>
  )
}

/* ------------------------------------------------------------------ */
/* Module                                                              */
/* ------------------------------------------------------------------ */

/**
 * Sits after the Vision-0 band on /#/products. Same container, same hairline
 * top edge and same reveal cascade as the product bands — page-internal only,
 * no nav entry, no route of its own.
 */
export default function ProductSpecsSection() {
  const { title, subtitle, description, columns, tables } = productSpecs

  return (
    <section className="relative border-t border-white/5">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 py-20 md:py-28">
        {/* Title block — heading → subtitle → silver one-liner */}
        <Reveal
          as="h2"
          className="font-bold tracking-tight leading-[1.1] text-[clamp(1.75rem,3.5vw,3rem)]"
        >
          {title}
        </Reveal>

        <Reveal delay={1} className="mt-4 text-lg text-white/75 md:text-xl">
          {subtitle}
        </Reveal>

        <Reveal delay={2} className="mt-4">
          <p className="max-w-xl text-base text-mute">{description}</p>
        </Reveal>

        {/* Two independent panels — stacked, with a clear gap between */}
        <div className="mt-16 space-y-16 md:mt-20 md:space-y-24">
          {tables.map((table, i) => (
            <SpecTable key={table.index} table={table} delay={i + 1} columns={columns} />
          ))}
        </div>
      </div>
    </section>
  )
}
