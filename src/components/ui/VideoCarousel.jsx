import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * Horizontal video carousel — 1 / 2 / 3 slides visible on mobile / tablet /
 * desktop, looping in both directions, with one pagination dot per clip.
 *
 * Why it is built this way:
 *
 * - **Loop without a jump.** The track renders the list twice (`looped`), so
 *   "next" from the last page can slide onto the clone of page 0. Once the
 *   slide finishes, `slot` is snapped back to 0 with the transition disabled
 *   — the same trick as the site's `.marquee`, just in JS. "Prev" from page 0
 *   is the mirror image: jump (no transition) onto the clone, then slide one
 *   step left.
 * - **Loading.** A clip only gets a `src` while it is one of the visible
 *   slides, so at most 3 of the 9 files are ever in flight. The poster (a
 *   still frame grabbed from the clip) holds every other slide, so the row
 *   never collapses into empty boxes.
 * - **Playback.** Only visible slides play, and only while the carousel is
 *   itself on screen. Everything else is paused and unloaded. Muted +
 *   playsInline + the muted assert is what makes playback legal without a
 *   gesture; some browsers drop React's `muted` prop on first mount.
 *
 * Slide widths and the slide offset live in CSS (`--per-view`), not JS, so
 * the responsive breakpoints stay in one place. JS mirrors the same number
 * (`perView`) because it needs it to decide which clips count as visible.
 */

const TRANSITION_MS = 600

/** Breakpoints mirrored from the CSS (`--per-view`). */
function usePerView() {
  const [perView, setPerView] = useState(1)

  useEffect(() => {
    const tablet = window.matchMedia('(min-width: 768px)')
    const desktop = window.matchMedia('(min-width: 1024px)')

    const update = () => setPerView(desktop.matches ? 3 : tablet.matches ? 2 : 1)
    update()

    tablet.addEventListener('change', update)
    desktop.addEventListener('change', update)
    return () => {
      tablet.removeEventListener('change', update)
      desktop.removeEventListener('change', update)
    }
  }, [])

  return perView
}

/** One slide. `src` is withheld until it is visible — that is the lazy part. */
function CarouselSlide({ video, active, playing }) {
  const videoRef = useRef(null)

  /* Muted assert — see the note at the top of the file. */
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = true
  }, [])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    if (active && playing) {
      const played = el.play()
      if (played && typeof played.catch === 'function') played.catch(() => {})
    } else {
      /* Not visible (or the carousel is off-screen) → stop decoding.
         This branch has to cover `!active` too: pausing only when `active`
         leaves the clips that just scrolled out of the window running. */
      el.pause()
    }
  }, [active, playing])

  return (
    <div className="carousel-item px-2 md:px-3">
      <div className="group relative aspect-[2/1] w-full overflow-hidden border border-white/10 bg-gradient-to-br from-ink2 to-ink3 transition-colors duration-300 hover:border-brandLine">
        <video
          ref={videoRef}
          /* undefined until visible → nothing is downloaded for hidden slides */
          src={active ? video.src : undefined}
          poster={video.poster}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          className="h-full w-full object-contain outline-none"
        />

        {/* Brand hover wash — a flat 5% tint, no gradient and no glow */}
        <span
          className="pointer-events-none absolute inset-0 bg-brandSoft opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

function Arrow({ direction, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group shrink-0 flex h-10 w-10 items-center justify-center border border-white/15 text-white/60 transition-colors duration-300 hover:border-brandLine hover:text-brand md:h-12 md:w-12 focus:outline-none focus-visible:ring-1 focus-visible:ring-brandLine"
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-4 w-4 md:h-5 md:w-5 ${direction === 'left' ? 'rotate-180' : ''}`}
        aria-hidden="true"
      >
        <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  )
}

export default function VideoCarousel({ videos }) {
  const count = videos.length
  /* Two copies back-to-back: the second one is what makes the loop seamless. */
  const looped = useMemo(() => [...videos, ...videos], [videos])

  const perView = usePerView()
  const [slot, setSlot] = useState(0)
  const [anim, setAnim] = useState(true)
  const [inView, setInView] = useState(false)
  const viewportRef = useRef(null)
  const timers = useRef([])

  /* The page actually being shown — `slot` can temporarily sit at `count`
     (the clone position) while the loop resolves. */
  const page = ((slot % count) + count) % count

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  const after = (ms, fn) => {
    timers.current.push(setTimeout(fn, ms))
  }
  useEffect(() => clearTimers, [])

  /* Playback is gated on the carousel itself being on screen. */
  useEffect(() => {
    const el = viewportRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.15,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const next = () => {
    clearTimers()
    setAnim(true)
    const target = slot + 1
    setSlot(target)

    /* Landed on the clone → it looks identical to page 0, so snap back
       once the slide has finished. */
    if (target >= count) {
      after(TRANSITION_MS + 60, () => {
        setAnim(false)
        setSlot(0)
        after(60, () => setAnim(true))
      })
    }
  }

  const prev = () => {
    clearTimers()
    if (slot > 0) {
      setAnim(true)
      setSlot(slot - 1)
      return
    }
    /* At page 0 → hop onto the clone with no transition, then slide one
       step left so the movement still reads as "backwards". */
    setAnim(false)
    setSlot(count)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setAnim(true)
        setSlot(count - 1)
      })
    )
  }

  const goto = (i) => {
    clearTimers()
    setAnim(true)
    setSlot(i)
  }

  /* Touch swipe — horizontal only, vertical scrolling stays with the page. */
  const touchStart = useRef(0)
  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX
  }
  const onTouchEnd = (e) => {
    const delta = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(delta) < 40) return
    if (delta < 0) next()
    else prev()
  }

  /**
   * Which rendered node is currently on screen.
   *
   * Position-based (not modulo-based) on purpose: exactly `perView` nodes —
   * one copy of each visible clip — ever carry a `src`, so no file is decoded
   * twice. The trade-off is that during the one-frame loop hand-off the
   * clone nodes pick the files up again; they are already in the browser
   * cache by then, so it costs nothing.
   */
  const isActive = (position) => position >= slot && position < slot + perView

  return (
    <div>
      <div className="flex items-center gap-3 md:gap-5">
        <Arrow direction="left" onClick={prev} label="Previous videos" />

        {/* Viewport — clips the track; the track is what moves. */}
        <div
          ref={viewportRef}
          className="relative flex-1 overflow-hidden"
          style={{ touchAction: 'pan-y' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className={`carousel-track ${anim ? '' : 'no-anim'}`}
            style={{ '--slot': slot }}
          >
            {looped.map((video, i) => (
              <CarouselSlide
                /* `i` is the position in the doubled track, which is what
                   decides visibility — both copies share one source file */
                key={`${video.id}-${i < count ? 'a' : 'b'}`}
                video={video}
                active={isActive(i)}
                playing={inView}
              />
            ))}
          </div>
        </div>

        <Arrow direction="right" onClick={next} label="Next videos" />
      </div>

      {/* Pagination — one dot per clip; the active page takes the brand blue */}
      <div className="mt-8 flex items-center justify-center gap-2.5">
        {videos.map((video, i) => (
          <button
            key={video.id}
            type="button"
            onClick={() => goto(i)}
            aria-label={`Show video ${i + 1}`}
            aria-current={i === page}
            className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-brandLine ${
              i === page ? 'w-6 bg-brand' : 'w-1.5 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
