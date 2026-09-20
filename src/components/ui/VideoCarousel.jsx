import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * Coverflow video carousel — the ACTIVE clip sits dead centre at full 16:9,
 * the previous and next clips are scaled-down, dimmed PREVIEWS that slide
 * UNDERNEATH it, and all three move together on every step.
 *
 * How the geometry works (see `.cf-stage` in index.css for the numbers):
 *
 * - **Every slide is absolutely stacked, not laid out in a row.** Each one
 *   carries `--cf-n`, its signed distance from the centre (0 = active,
 *   ±1 = preview, ±2 = parked off-frame). The transform is derived from that
 *   single number, so a step is one number animating per slide — which is
 *   what produces the continuous three-up movement instead of two elements
 *   swapping places.
 * - **`scale` reads the `--cf-side-scale` variable**, so each breakpoint can
 *   pick its own preview size without a JS media query having to mirror the
 *   CSS. `--cf-active-w` sets how wide the centre clip is; the stage height
 *   is derived from it (see the padding-bottom note below).
 * - **Overlap is structural, not a margin.** `--cf-step` is deliberately
 *   SMALLER than 100% of the slide's own width, so a preview lands inside
 *   the centre slide's footprint. Combined with opacity/z-index it is the
 *   active slide — which has an opaque frame and the highest z-index — that
 *   covers the previews' inner edges. Nothing ever overlaps by accident.
 * - **Loop without a jump.** The list is rendered twice, so "next" past the
 *   last clip steps onto the clone of clip 0 and then snaps back to the real
 *   clip 0 with transitions disabled (`is-snapping`) — the two look
 *   identical, so nothing moves.
 * - **Loading & playback.** Only the CENTRE slide gets a `src`, so exactly
 *   one file is in flight; previews show their poster still. Only the centre
 *   slide plays, and only while the carousel is itself on screen. Everything
 *   else is paused. Muted + playsInline + the muted assert is what makes
 *   that playback legal without a gesture.
 * - **Input.** Arrows, dots, touch swipe, clicking a preview, and the
 *   left/right arrow keys (while the carousel is on screen) all drive the
 *   same `next` / `prev` / `goto`.
 */

const TRANSITION_MS = 550

/** Park distance — anything further than a preview sits here, invisible. */
const MAX_OFFSET = 2

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

/**
 * Look of one slide given its distance from the centre.
 *
 * `scale` deliberately references the CSS variable instead of a JS number:
 * the desktop and mobile preview sizes then live in one place (index.css)
 * and can never drift from each other.
 */
function look(distance) {
  const steps = Math.abs(distance)

  /* ACTIVE — full size, undimmed, on top. */
  if (steps === 0) {
    return {
      '--cf-scale': '1',
      '--cf-opacity': '1',
      '--cf-brightness': '1',
      '--cf-z': 30,
    }
  }

  /* PREVIEW — smaller, dimmed, pushed behind the active slide. */
  if (steps === 1) {
    return {
      '--cf-scale': 'var(--cf-side-scale)',
      '--cf-opacity': '0.32',
      '--cf-brightness': '0.55',
      '--cf-z': 20,
    }
  }

  /* PARKED — waiting one step away from becoming a preview. Keeping the node
     mounted (rather than rendering a window of nodes) is what lets it
     animate in instead of popping. */
  return {
    '--cf-scale': 'calc(var(--cf-side-scale) * 0.72)',
    '--cf-opacity': '0',
    '--cf-brightness': '0.4',
    '--cf-z': 10,
  }
}

/**
 * One slide. `active` drives both the source and playback; `offset` (the
 * signed distance from the centre) drives every visual property.
 */
function CarouselSlide({ video, offset, active, playing, onSelect }) {
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
      /* Not centred (or the carousel is off-screen) → stop decoding.
         This branch has to cover `!active` too: pausing only when `active`
         leaves the clips that just stepped out of the centre running. */
      el.pause()
    }
  }, [active, playing])

  /* Clamped so parked slides stack at the park distance instead of flying
     further out the further away they are. */
  const visual = look(offset)

  return (
    <div
      className="cf-item"
      style={{ '--cf-n': clamp(offset, -MAX_OFFSET, MAX_OFFSET), ...visual }}
      aria-hidden={active ? undefined : true}
      /* Only previews are clickable — the active slide has nothing to do. */
      onClick={active ? undefined : onSelect}
    >
      {/* 16:9 comes from the stage's own aspect rules; `object-contain`
          inside keeps the clip whole — never cropped, never stretched. */}
      <div
        className={`group relative h-full w-full overflow-hidden border border-white/10 bg-gradient-to-br from-ink2 to-ink3 transition-colors duration-300 ${
          active ? 'hover:border-brandLine' : ''
        }`}
      >
        <video
          ref={videoRef}
          /* undefined until centred → nothing is downloaded for the rest */
          src={active ? video.src : undefined}
          poster={video.poster}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          className={`h-full w-full object-contain outline-none ${
            active ? '' : 'pointer-events-none'
          }`}
        />

        {/* Brand hover wash — a flat 5% tint, no gradient and no glow */}
        {active && (
          <span
            className="pointer-events-none absolute inset-0 bg-brandSoft opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
          />
        )}
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
      className="group relative z-40 shrink-0 flex h-10 w-10 items-center justify-center border border-white/15 text-white/60 transition-colors duration-300 hover:border-brandLine hover:text-brand md:h-12 md:w-12 focus:outline-none focus-visible:ring-1 focus-visible:ring-brandLine"
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

    /* Landed on the clone → it looks identical to page 0, so snap back once
       the slide has finished. Transitions are off for that one frame,
       otherwise every slide would animate from the clone position to the
       real one and visibly shuffle the whole row. */
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
    /* At page 0 → hop onto the clone with no transition, then step back one
       so the movement still reads as "backwards". */
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

  /* Keyboard — left/right arrows page the carousel, but only while it is
     actually on screen so the keys never fight another section. `slot` is a
     dependency because next/prev read it when they run. */
  useEffect(() => {
    if (!inView) return
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [inView, slot])

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
   * Circular distance from the centre.
   *
   * A plain `i - slot` would leave the LEFT PREVIEW missing at the first
   * page — nothing sits to the left of index 0. Wrapping into the doubled
   * range fixes it: at page 0 the previous clip is found at the far end of
   * the second copy, which is exactly what a loop means. The only nodes that
   * ever become visible are `0` (centre) and `±1` (previews); everything
   * else sits further out and is invisible anyway.
   */
  const distanceTo = (i) => {
    const span = looped.length
    let d = (((i - slot) % span) + span) % span
    /* Fold the far half into negatives so the row is centred on the slot.
       `d === count` is the duplicate of the centre — left far away. */
    if (d > count) d -= span
    return d
  }

  return (
    <div>
      <div className="flex items-center gap-3 md:gap-5">
        <Arrow direction="left" onClick={prev} label="Previous videos" />

        {/* Stage — every slide is absolutely stacked inside it, and its
            overflow does the clipping at the left and right edges.
            `cf-shell` is what declares the layout variables (see index.css);
            once there was also a `.cf-caption` above it, and this element
            kept both roles — there is nothing between it and the arrows
            now, so no space is reserved above the videos. */}
        <div
          ref={viewportRef}
          className={`cf-shell cf-stage min-w-0 flex-1 ${anim ? '' : 'is-snapping'}`}
          style={{ touchAction: 'pan-y' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {looped.map((video, i) => (
            <CarouselSlide
              /* `i` is the position in the doubled track, which is what
                 decides visibility — both copies share one source file */
              key={`${video.id}-${i < count ? 'a' : 'b'}`}
              video={video}
              offset={distanceTo(i)}
              active={i === slot}
              playing={inView}
              onSelect={() => goto(i >= count ? i - count : i)}
            />
          ))}
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
