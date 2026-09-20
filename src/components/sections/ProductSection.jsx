import ProductVisual from '../ui/ProductVisual'
import Reveal from '../ui/Reveal'

/**
 * One full-width product band — image + info, alternating sides.
 *
 *   IMAGE ~52%  |  TEXT ~42%  (rest is the gutter)
 *
 * The visual always comes first in the DOM, which gives the mobile
 * stack (image on top, text below) for free; on md+ the `reverse`
 * flag flips the two columns so the sides alternate down the page.
 *
 * Not a card: no panel, no fill. The only divider is the hairline at the
 * top of the band — hierarchy comes from the ordinal and type scale.
 */
export default function ProductSection({ item }) {
  const visualOrder = item.reverse ? 'md:order-2' : ''
  const textOrder = item.reverse ? 'md:order-1' : ''

  /* `order` moves a column but does NOT resize it, so the track template has
     to be mirrored too — otherwise the reversed band would give the visual
     the narrow 42% track and the text the wide one. Both layouts keep the
     visual at ~52% and the text at ~42%. */
  const gridCols = item.reverse ? 'md:grid-cols-[4fr_5fr]' : 'md:grid-cols-[5fr_4fr]'

  return (
    <section className="relative border-t border-white/5">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 py-16 md:py-0 md:min-h-[56vh] flex items-center">
        <div className={`w-full grid items-center gap-10 md:gap-16 ${gridCols}`}>
          {/* Visual */}
          <Reveal className={visualOrder}>
            <ProductVisual
              imageSrc={item.imageSrc}
              videoSrc={item.videoSrc}
              label={item.placeholderLabel}
              alt={item.name}
              halo={item.halo}
            />
          </Reveal>

          {/* Info — ordinal → name → slogan → feature chips */}
          <div className={textOrder}>
            <Reveal delay={1} className="text-xs font-mono tracking-[0.3em] text-brand">
              {item.index}
            </Reveal>

            <Reveal
              as="h2"
              delay={2}
              className="mt-4 font-bold tracking-tight leading-[1.1] text-[clamp(1.75rem,3.5vw,3rem)]"
            >
              {item.name}
            </Reveal>

            <Reveal delay={3} className="mt-5">
              <p className="text-lg md:text-xl text-white/75 tracking-[0.06em]">{item.slogan}</p>
            </Reveal>

            {/* Optional — `features: []` drops the whole row (see Glove-0) */}
            {item.features?.length > 0 && (
              <Reveal delay={4} className="mt-6">
                <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs md:text-sm text-mute">
                  {item.features.map((feature, i) => (
                    <li key={feature} className="flex items-center gap-3">
                      {i > 0 && (
                        <span className="text-white/20" aria-hidden="true">
                          |
                        </span>
                      )}
                      {feature}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
