import { overview } from '../../data/site'
import Reveal from '../ui/Reveal'
import VideoCarousel from '../ui/VideoCarousel'

/* ------------------------------------------------------------------ */
/* Reconstruction Visualization                                        */
/* ------------------------------------------------------------------ */

/**
 * A standalone section that now OWNS the coverflow carousel. The carousel
 * used to sit at the bottom of the HumanPlus-1000 (Overview) section; it
 * lives here so it reads as its own module instead of as a trailing part
 * of the dataset overview.
 *
 * Everything else is the site's shared vocabulary: the same H2 scale as
 * every other section title, the same `py-32 md:py-40` rhythm, the same
 * `max-w-7xl` container. Only the copy and the media differ. The carousel
 * itself (VideoCarousel) is reused untouched — same clips, same logic,
 * same rounding, same responsive behaviour.
 */
export default function ReconstructionSection() {
  return (
    <section className="relative py-[85px] md:py-[107px]">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10">
        {/* Kicker — same small mono label vocabulary as the OVERVIEW block */}
        <Reveal className="text-xs font-mono text-mute uppercase tracking-[0.3em]">
          {overview.reconstruction.label}
        </Reveal>

        {/* Title — same H2 scale as every other section title */}
        <Reveal
          as="h2"
          delay={1}
          className="mt-4 font-black tracking-tight leading-[1.2] text-[clamp(1.25rem,4vw,3rem)]"
        >
          {overview.reconstruction.title}
        </Reveal>

        {/* Description — same rhythm as the OVERVIEW body copy */}
        <Reveal delay={2} className="mt-8 max-w-xl">
          <p className="text-base leading-relaxed text-white/70">
            {overview.reconstruction.description}
          </p>
        </Reveal>

        <Reveal delay={3} className="mt-16 md:mt-20">
          <VideoCarousel videos={overview.visualizations.videos} />
        </Reveal>
      </div>
    </section>
  )
}
