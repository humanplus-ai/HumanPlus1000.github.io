import ProductSection from '../components/sections/ProductSection'
import ProductSpecsSection from '../components/sections/ProductSpecsSection'
import Reveal from '../components/ui/Reveal'
import { products } from '../data/site'

/**
 * Products page — a vertical product narrative:
 *   Product → Product
 *
 * Everything comes from `products` in src/data/site.js, so copy and assets
 * are edited in one place. English only, matching the rest of the site.
 */

export default function Products() {
  return (
    <div>
      {/* Hero — label + title + one line, then a lot of air */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
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

      {/* The bands — products follow one another with no divider between
          them; the sections' own top/bottom padding carries the rhythm. */}
      {products.items.map((item) => (
        <ProductSection key={item.index} item={item} />
      ))}

      {/* TECHNICAL SPECIFICATIONS — closes the page with both spec tables,
          stacked. Page-internal only: no nav entry, no route of its own. */}
      <ProductSpecsSection />
    </div>
  )
}
