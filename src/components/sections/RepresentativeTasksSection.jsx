import { useEffect, useRef } from 'react'
import { representativeTasks } from '../../data/site'
import Reveal from '../ui/Reveal'

/* ------------------------------------------------------------------ */
/* Task video frame                                                    */
/* ------------------------------------------------------------------ */

/**
 * 16:9 frame for one representative task. Reusable across all six cells.
 *
 * Renders a real looping clip as soon as `src` is set; until then it falls
 * back to a flat placeholder (play glyph + VIDEO label). Swapping in real
 * footage later needs no layout change — only a `videoSrc` path in site.js.
 */
function TaskVideo({ src, label }) {
  const videoRef = useRef(null)

  /* Same guard as Hero/DEMO/Multimodal: browsers only autoplay muted video,
     and some drop React's `muted` prop on first mount — assert it and kick
     playback off, otherwise the clip would freeze on frame one. */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    const played = video.play()
    if (played && typeof played.catch === 'function') played.catch(() => {})
  }, [])

  return (
    <div className="relative aspect-video w-full bg-gradient-to-br from-ink2 to-ink3 border border-white/10 overflow-hidden transition-colors duration-300 group-hover:border-brandLine">
      {src ? (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <span className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white/60 transition-colors duration-300 group-hover:border-brandLine group-hover:text-brand">
            <svg viewBox="0 0 24 24" className="w-5 h-5 translate-x-[1px]" aria-hidden="true">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-mute transition-colors duration-300 group-hover:text-brand/70">
            {label}
          </span>
        </div>
      )}

      {/* Brand hover wash — a flat 5% tint, no gradient and no glow */}
      <span
        className="pointer-events-none absolute inset-0 bg-brandSoft opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* One task cell — ordinal + title, then the dominant video            */
/* ------------------------------------------------------------------ */

function TaskCell({ task, placeholderLabel }) {
  return (
    /* `group` scopes the hover tint to this cell only */
    <div className="group flex flex-col">
      {/* Ordinal + English task name — the cell heading.
          Only the ordinal number carries the brand colour. */}
      <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-white">
        <span className="text-brand">{task.index}</span> / {task.title}
      </h3>

      {/* Video — the main visual element of the cell */}
      <div className="mt-6">
        <TaskVideo src={task.videoSrc} label={placeholderLabel} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Representative Tasks                                                */
/* ------------------------------------------------------------------ */

/**
 * English only. Restyled to match the shared design language:
 * small label → large two-word title → description → 3×2 grid of tasks.
 * No cards, no heavy shadows, no gradient — hierarchy is carried by
 * typography, the hairline video borders and generous whitespace.
 */
export default function RepresentativeTasksSection() {
  const { tasks, placeholderLabel } = representativeTasks

  return (
    <section className="relative py-32 md:py-40">
      {/* id="tasks" — page order places this between Multimodal and Download.
          Anchor is on the content wrapper (skips the section's top padding). */}
      <div id="tasks" className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10">
        {/* Small section label */}
        <Reveal className="text-xs font-mono tracking-[0.3em] text-mute">
          {representativeTasks.label}
        </Reveal>

        {/* Main title */}
        <Reveal
          as="h2"
          delay={1}
          className="mt-4 font-black tracking-tight leading-[1.2] text-[clamp(1.25rem,4vw,3rem)]"
        >
          {representativeTasks.title}
        </Reveal>

        {/* Description */}
        <Reveal delay={2} className="mt-6">
          <p className="max-w-xl text-base text-white/70">{representativeTasks.description}</p>
        </Reveal>

        {/* 3 × 2 grid — 3 cols desktop, 2 cols tablet, 1 col mobile */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14 md:gap-8">
          {tasks.map((task, i) => (
            <Reveal key={task.title} delay={i} className="relative">
              <TaskCell task={task} placeholderLabel={placeholderLabel} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
