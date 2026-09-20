import { Fragment } from 'react'
import ProductSection from '../components/sections/ProductSection'
import Reveal from '../components/ui/Reveal'
import { products } from '../data/site'

/**
 * Products page — a vertical product narrative:
 *   Product → Product
 *
 * Everything comes from `products` in src/data/site.js, so copy and assets
 * are edited in one place. English only, matching the rest of the site.
 */

/**
 * The horizontal band that separates two product sections.
 *
 * Not a card and not a divider line: a full-width dark-grey strip (#16181C →
 * #22252B → #16181C) whose gradient drifts sideways very slowly (26s per
 * pass). It gives the page a horizontal rhythm and keeps the eye moving
 * between products. The radial overlay dissolves both ends into the page
 * background so the strip never reads as a hard-edged block.
 */
function BandDivider() {
  return (
    <div className="relative h-20 overflow-hidden md:h-28" aria-hidden="true">
      <span className="sheen-track sheen-gradient absolute inset-y-0 left-0 w-[200%]" />
      <span
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 100% at 50% 50%, rgba(10,10,10,0) 30%, #0a0a0a 100%)',
        }}
      />
    </div>
  )
}

export default function Products() {
  return (
    <div>
      {/* Hero — label + title + one line, then a lot of air */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-28">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="text-xs font-mono tracking-[0.3em] text-mute">{products.label}</Reveal>

          <Reveal
            as="h1"
            delay={1}
            className="mt-6 font-black tracking-tight leading-[1.05] text-[clamp(2rem,6vw,4.5rem)]"
          >
            {products.title}
          </Reveal>

          <Reveal delay={2} className="mt-8">
            <p className="max-w-xl text-base md:text-lg text-white/70">{products.description}</p>
          </Reveal>
        </div>
      </section>

      {/* The bands — a sheen strip sits between consecutive products */}
      {products.items.map((item, i) => (
        <Fragment key={item.index}>
          {i > 0 && <BandDivider />}
          <ProductSection item={item} />
        </Fragment>
      ))}
    </div>
  )
}
