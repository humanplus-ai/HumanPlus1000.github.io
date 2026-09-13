/**
 * Single source of truth for all editable site content.
 *
 * Convention: one export per page section.
 * When you add a new section, add its export here and import it in that component.
 *
 * Media note:
 *   `media` fields are null while we have no final assets.
 *   Components fall back to the built-in SVG/CSS placeholder when null.
 *   Drop real files into  public/videos/  or  public/images/  and set the path here.
 */

/* ------------------------------------------------------------------ */
/* Site-wide                                                           */
/* ------------------------------------------------------------------ */

export const site = {
  /* Shown in exactly two places: the nav's top-left wordmark and the
     footer's bottom-left label. (site.title stays "HumanPlus1000 …" and is
     untouched.) */
  brand: 'HumanPlus',
  title: 'HumanPlus1000 — 1000-Hour Embodied Motion Dataset',
  description:
    'From the real world to world-human models: 1000 hours of synchronized first-person vision and whole-body motion data.',
}

export const nav = {
  links: [
    { label: 'Overview', href: '#overview' },
    { label: 'Dataset', href: '#dataset' },
    { label: 'Download', href: '#download' },
  ],
}

export const footer = {
  label: 'HumanPlus1000 Dataset',
  note: 'Synchronized human embodied data for embodied intelligence research.',
  email: 'info@humanplus.xyz',
  /* Year stays dynamic — renders "© 2026 HumanPlus" this year. */
  copyright: `© ${new Date().getFullYear()} HumanPlus`,
}

/* ------------------------------------------------------------------ */
/* Dataset statistics — SINGLE SOURCE OF TRUTH                         */
/* ------------------------------------------------------------------ */

/**
 * Core dataset numbers, keyed by meaning.
 *
 * Values below are placeholders. Replace them once the dataset statistics
 * are finalized — every section reads from this object, so changing a
 * number here updates the whole site at once.
 *
 * Referenced by:
 *   - Hero (01)              → hero.stats
 *   - Dataset Scale (03)     → TODO: pick from this object when built
 *   - Any later section that needs the same figures
 */
export const datasetStats = {
  /* `accent: true` → this figure is drawn in the brand highlight.
     Only the headline "1000" is highlighted; every other figure stays
     plain white/grey so the blue remains ~10% of the page. */
  /* The "+" belongs to the figure, so it lives in `value` and is drawn in
     the same (bold) weight as the number. `unit` stays empty: the Chinese
     words below are `label`, which keeps its own lighter weight. */
  hours: { value: '1000+', unit: '', label: 'Hour', accent: true },
  locations: { value: '100+', unit: '', label: 'Location' },
  tasks: { value: '500+', unit: '', label: 'Task' },
  people: { value: '200+', unit: '', label: 'People' },
}

/* ------------------------------------------------------------------ */
/* 01 — Cover / Hero                                                   */
/* ------------------------------------------------------------------ */

export const hero = {
  /* Top corner mono labels */
  liveLabel: 'LIVE — EMBODIED DATA STREAM',
  recLabel: 'REC / 2026',

  /**
   * Cover media — rendered in the lower-middle of the hero as an ambient
   * background layer. HeroSection feathers its edges into the black page
   * with a CSS radial mask; the media's low opacity doubles as the black
   * scrim.
   *
   * `videoSrc` wins when set: muted + looped + inline autoplay, using the
   * exact same container, mask and opacity as the still image before it.
   * `imageSrc` stays as the still fallback if the video is ever removed.
   * Set both to null to drop the layer entirely.
   */
  videoSrc: 'videos/hero/HumanV2.mp4',
  imageSrc: 'images/hero/cover.png',

  /* Pill above the title */
  pretitle: 'A 1000-hour synchronized human embodied dataset',

  /**
   * Title, rendered on two lines.
   * `accent` marks the part drawn in the accent colour.
   */
  title: {
    line1: { pre: 'HumanPlus', accent: '1000', post: '-Hour' },
    line2: 'Embodied Motion Dataset',
  },

  /**
   * Subtitle as ordered fragments.
   * Set `strong: true` to render a fragment in full white.
   * Edit the strings freely — order and count are up to you.
   */
  subtitle: [
    { text: 'From the Real World to ' },
    { text: 'World-Human Models', strong: true },
    { text: ', Building a Continuously Evolving ' },
    { text: 'Data Flywheel', strong: true },
  ],

  /**
   * Headline numbers — references datasetStats, so the values stay
   * consistent with every other section.
   * Reorder or drop entries here without touching the values themselves.
   */
  stats: [
    datasetStats.hours,
    datasetStats.locations,
    datasetStats.tasks,
    datasetStats.people,
  ],
}

/* ------------------------------------------------------------------ */
/* 02 — Demo                                                           */
/* ------------------------------------------------------------------ */

export const demo = {
  /* Small section label above the title (matches the other modules) */
  label: 'DEMO',

  /* Main title of the module — the dominant visual element */
  title: 'LIFE CAPTURE',

  /* One-line description under the title */
  description:
    'Experience how human motion and real-world interaction data can empower embodied intelligence and robot learning.',

  /* Text shown inside the frame while there is no real footage */
  placeholderLabel: 'DEMO VIDEO',

  /**
   * Real demo video path.
   * null → the frame renders the rectangle placeholder.
   *
   * Autoplayed (muted + looped + inline) whenever the frame scrolls into
   * view — see the IntersectionObserver in DemoSection.
   * Keep the path relative (no leading "/") so it also resolves under a
   * GitHub Pages sub-path.
   */
  videoSrc: 'videos/demo/HumanV4.mp4',
}

/* ------------------------------------------------------------------ */
/* 03 — Overview                                                       */
/* ------------------------------------------------------------------ */

export const overview = {
  /* Small mono kicker above the title */
  label: 'OVERVIEW',

  /* Title — left column headline */
  title: 'HumanPlus1000',

  /**
   * Body copy — one string per paragraph, no bold fragments.
   * (If bold ever comes back, switch a paragraph to the fragment form
   *  used by `hero.subtitle`: [{ text, strong }, ...].)
   */
  body: [
    'The HumanPlus1000-Hour Embodied Motion Dataset is a large-scale, multi-modal, and continuously evolving human data infrastructure for embodied intelligence and robot learning.',
    'HumanPlus1000 integrates first-person vision, whole-body motion, hand movements, human-object interactions, and real-world changes into a unified spatiotemporal representation, capturing how humans perceive, act, interact, and change the world. It covers diverse real-world scenarios, including campus life, industrial operations, logistics, warehousing, and household activities.',
    'Through standardized data collection, multi-modal synchronization, structured annotation, and quality control, HumanPlus1000 provides a scalable data foundation for imitation learning, World-Human Model development, and real-world robot deployment.',
  ],

  /* Text shown inside the frame while there is no real image */
  placeholderLabel: 'IMAGE PLACEHOLDER',

  /**
   * Real overview image path.
   * null → the frame renders the rectangle placeholder.
   * Relative (no leading "/") so it also works under a Pages sub-path.
   */
  imageSrc: 'images/overview/humanv4-cover.jpg',
}

/* ------------------------------------------------------------------ */
/* 04 — Multimodal Data                                                */
/* ------------------------------------------------------------------ */

/**
 * English only — this module shows no Chinese anywhere.
 * Anchored by the nav "Dataset" link, hence id="dataset" on the section.
 */
export const multimodal = {
  /* Small section label above the title */
  label: 'Dataset',

  /* Main title of the module */
  title: 'MULTIMODAL DATA',

  /* One-line description under the title */
  description: 'Capturing human behavior from multiple perspectives.',

  /* Text shown inside a column frame while there is no real footage */
  placeholderLabel: 'VIDEO PLACEHOLDER',

  /**
   * The three modality columns.
   * `videoSrc: null` → the column renders the placeholder rectangle.
   * Drop real clips into public/videos/multimodal/ and set e.g.
   * 'videos/multimodal/vision.mp4'
   *
   * `index` is the small ordinal in the column heading ("01 / VISUAL …").
   */
  cards: [
    {
      index: '01',
      title: 'Visual Perception',
      desc: 'First-person videos capture the environment, objects, and scene dynamics.',
      tags: 'Ego Vision · Objects · Environment',
      videoSrc: 'videos/multimodal/Visual.mp4',
    },
    {
      index: '02',
      title: 'Human Motion',
      desc: 'Motion capture records full-body pose and movement trajectories.',
      tags: 'Full-body Motion · Pose · IMU',
      videoSrc: 'videos/multimodal/Motion.mp4',
    },
    {
      index: '03',
      title: 'Spatial Interaction',
      desc: 'Capturing spatial relationships and interactions between humans, objects, and environments.',
      tags: 'Human–Object · Interaction · Spatial Context',
      videoSrc: null,
    },
  ],
}

/* ------------------------------------------------------------------ */
/* 05 — Download / Open Source                                         */
/* ------------------------------------------------------------------ */

/**
 * English only — this module shows no Chinese anywhere.
 * Anchored by the nav "Download" link, hence id="download" on the section.
 *
 * Replace `panel.cta.url` with the real Hugging Face dataset URL once it
 * exists. While it stays null, the "ACCESS DATASET" link is inert (#).
 */
export const download = {
  /* Small section label above the title — matches the nav item */
  label: 'Download',

  /* Main title of the module */
  title: 'OPEN SOURCE',

  /* The single wide panel: left content + right CTA, no card fill */
  panel: {
    /* Small mono heading inside the panel */
    heading: 'HUMAN1000 DATASET',

    /* Two body lines */
    bodyPrimary: 'Explore and access the Human1000 dataset on Hugging Face.',
    bodySecondary:
      'A large-scale multimodal dataset capturing human motion, first-person vision, and real-world interactions.',

    /* One-line dataset summary */
    statsLine: '1000+ HOURS  ·  200+ PEOPLE  ·  500+ TASKS  ·  100+ LOCATIONS',

    /* Right-side CTA. Opens the Hugging Face dataset in a new tab
       (DownloadSection already applies target="_blank" + rel=noopener). */
    cta: {
      label: 'ACCESS DATASET',
      url: 'https://huggingface.co/datasets/humanplus-ai/HumanPlus-1000',
    },
  },
}

/* ------------------------------------------------------------------ */
/* Representative Tasks                                                */
/* Page order: rendered between Multimodal Data (04) and Download (05) */
/* ------------------------------------------------------------------ */

/**
 * English only — this module shows no Chinese anywhere.
 * Six representative data-collection tasks, laid out as a 3 × 2 grid.
 */
export const representativeTasks = {
  /* Small section label above the title */
  label: 'ACTIVITIES',

  /* Main title of the module */
  title: 'REPRESENTATIVE TASKS',

  /* One-line description under the title */
  description: 'A glimpse into the diverse activities captured by Human1000.',

  /* Text shown inside a task frame while there is no real footage */
  placeholderLabel: 'VIDEO',

  /**
   * The six representative tasks.
   * `videoSrc: null` → the frame renders the placeholder rectangle.
   * Drop real clips into public/videos/tasks/ and set e.g.
   * 'videos/tasks/dishwashing.mp4' to replace a placeholder.
   *
   * `index` is the small ordinal in the task heading ("01 / DISHWASHING").
   */
  tasks: [
    { index: '01', title: 'DISHWASHING', videoSrc: null },
    { index: '02', title: 'SWEEPING', videoSrc: null },
    { index: '03', title: 'TEA PREPARATION', videoSrc: null },
    { index: '04', title: 'FOLDING CLOTHES', videoSrc: null },
    { index: '05', title: 'HANDLING TRAYS', videoSrc: null },
    { index: '06', title: 'WORKPIECE PROCESSING', videoSrc: null },
  ],
}
