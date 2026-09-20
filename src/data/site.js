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
     footer's bottom-left label. (site.title stays "HumanPlus-1000 …" and is
     untouched.) */
  brand: 'HumanPlus',
  title: 'HumanPlus-1000 — 1000-Hour Embodied Motion Dataset',
  description:
    'From the real world to world-human models: 1000 hours of synchronized first-person vision and whole-body motion data.',
}

export const nav = {
  /**
   * Two link kinds:
   *   { href: '#dataset' }        → home page, scrolls to that section
   *   { href: '#/products', page } → the Products sub-page (see useHashRoute)
   *
   * Labels keep the existing title case so the bar reads as one set.
   */
  links: [
    { label: 'Overview', href: '#overview' },
    { label: 'Dataset', href: '#dataset' },
    { label: 'Products', href: '#/products', page: 'products' },
    { label: 'Research', href: '#research' },
    { label: 'Download', href: '#download' },
  ],
}

export const footer = {
  label: 'HumanPlus-1000 Dataset',
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
  videoSrc: null,
  imageSrc: 'images/hero/hero-cover.png',

  /* First-frame poster shown instantly while the clip buffers — keeps the
     hero from flashing black before playback starts. Relative path so it
     also resolves under a GitHub Pages sub-path. */
  posterSrc: 'videos/hero/hero_poster.png',

  /* Pill above the title */
  pretitle: 'A 1000-hour synchronized human embodied dataset',

  /**
   * Title — a single line "HumanPlus-1000" with the headline styling.
   * `accent` marks the part drawn in the accent colour (the "1000").
   */
  title: {
    line1: { pre: 'HumanPlus-', accent: '1000', post: '' },
  },

  /**
   * Subtitle — a single, unified two-line text block directly under the
   * title. Both lines share identical font, size, weight and line spacing
   * (the site's standard sans body font, regular weight) and are centred,
   * so the pair reads as one cohesive two-line subtitle rather than two
   * separate tiers.
   */
  subtitle: [
    'A Large-Scale Human Dataset for Whole-Body Intelligence',
    'From the Real World to World-Human Models, Building a Continuously Evolving Data Flywheel',
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

  /* First-frame poster shown while the clip buffers. Relative path. */
  posterSrc: 'videos/demo/HumanHeroV5.jpg',

  /**
   * Real demo video path.
   * null → the frame renders the rectangle placeholder.
   *
   * Autoplayed (muted + looped + inline) whenever the frame scrolls into
   * view — see the IntersectionObserver in DemoSection.
   * Keep the path relative (no leading "/") so it also resolves under a
   * GitHub Pages sub-path.
   */
  videoSrc: 'videos/demo/HeroV5.mp4',

  /* The 2 × 2 sample grid that used to sit under the main reel was removed:
     the module is now just the reel (label → title → description → video).
     Leftover assets still live in public/videos/demo/samples/ until they are
     cleaned up, but nothing references them any more. */
}

/* ------------------------------------------------------------------ */
/* 03 — Overview                                                       */
/* ------------------------------------------------------------------ */

export const overview = {
  /* Small mono kicker above the title */
  label: 'OVERVIEW',

  /* Title — left column headline */
  title: 'HumanPlus-1000',

  /**
   * Body copy — one string per paragraph, no bold fragments.
   * (If bold ever comes back, switch a paragraph to the fragment form
   *  used by `hero.subtitle`: [{ text, strong }, ...].)
   */
  body: [
    'HumanPlus-1000 integrates first-person vision, whole-body motion, hand movements, human-object interactions, and real-world changes into a unified spatiotemporal representation. It captures how humans perceive, act, and interact with the world across diverse real-world scenarios, including campus life, industrial operations, logistics, and household activities.',
    'Through standardized data collection and multi-modal synchronization, HumanPlus-1000 provides a scalable data foundation for imitation learning, World-Human Model development, and real-world robot learning.',
  ],

  /* Text shown inside the frame while there is no real media */
  placeholderLabel: 'IMAGE PLACEHOLDER',

  /**
   * Poster / still fallback — the cover frame of 厨房v3, shown until the
   * clip starts. Source: 图片素材\demo\厨房v3-封面.jpg (copied, original
   * untouched); renamed to ASCII so the path stays safe in a URL.
   * Relative (no leading "/") so it also works under a Pages sub-path.
   */
  imageSrc: 'images/overview/kitchen-v3-cover.jpg',

  /**
   * Real overview video — 厨房v3 (图片素材\demo\厨房v3.mp4, copied; original
   * untouched, not re-encoded).
   *
   * ⚠️ NOT muted: this clip carries real audio, so it must not autoplay —
   * browsers block unmuted autoplay. OverviewSection shows the poster plus a
   * play button and hands playback to a user gesture. Do not "fix" a silent
   * start by re-adding `muted`.
   *
   * Relative (no leading "/") so it also works under a Pages sub-path.
   */
  videoSrc: 'videos/overview/kitchen-v3.mp4',

  /**
   * The single-clip demo carousel, rendered BELOW the HumanPlus-1000 text +
   * video grid (moved here from Dataset / MULTIMODAL DATA on 2026-09-20 —
   * Dataset now ends at 02 Human Motion).
   *
   * Nine clips, one horizontal carousel showing ONE clip at a time at every
   * breakpoint. See ui/VideoCarousel.jsx.
   *
   * - src     — MP4, relative (no leading "/") so it resolves under a
   *             GitHub Pages sub-path
   * - poster  — still frame grabbed from the clip at ~1.5s, so a slide shows
   *             real content before its video is allowed to download
   *
   * ⚠️ Source files were COPIED (not moved) from 图片素材\demo\sample1..9.mp4
   *    into public/videos/visualizations/ and renamed sample-01..09.mp4, so
   *    the folder order matches the carousel order. The originals are
   *    untouched. sample-01 and sample-03 are 42MB / 35MB — see the note in
   *    MEMORY.md about pushing large media to GitHub.
   */
  visualizations: {
    videos: [
      { id: 1, src: 'videos/visualizations/sample-01.mp4', poster: 'images/visualizations/sample-01.jpg' },
      { id: 2, src: 'videos/visualizations/sample-02.mp4', poster: 'images/visualizations/sample-02.jpg' },
      { id: 3, src: 'videos/visualizations/sample-03.mp4', poster: 'images/visualizations/sample-03.jpg' },
      { id: 4, src: 'videos/visualizations/sample-04.mp4', poster: 'images/visualizations/sample-04.jpg' },
      { id: 5, src: 'videos/visualizations/sample-05.mp4', poster: 'images/visualizations/sample-05.jpg' },
      { id: 6, src: 'videos/visualizations/sample-06.mp4', poster: 'images/visualizations/sample-06.jpg' },
      { id: 7, src: 'videos/visualizations/sample-07.mp4', poster: 'images/visualizations/sample-07.jpg' },
      { id: 8, src: 'videos/visualizations/sample-08.mp4', poster: 'images/visualizations/sample-08.jpg' },
      { id: 9, src: 'videos/visualizations/sample-09.mp4', poster: 'images/visualizations/sample-09.jpg' },
    ],
  },
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
  ],

  /**
   * 03 was removed on 2026-09-20: the nine-clip carousel moved down to the
   * OVERVIEW module (`overview.visualizations`), so MULTIMODAL DATA ends at
   * 02 Human Motion. Do not re-add a 03 block here — that would put the
   * carousel on the page twice.
   */
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
    heading: 'HUMANPLUS-1000 DATASET',

    /* Two body lines */
    bodyPrimary: 'Explore and access the HumanPlus-1000 dataset on Hugging Face.',
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
  description: 'A glimpse into the diverse activities captured by HumanPlus-1000.',

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
    { index: '01', title: 'DISHWASHING', videoSrc: 'videos/tasks/01.mp4' },
    { index: '02', title: 'SWEEPING', videoSrc: 'videos/tasks/02.mp4' },
    { index: '03', title: 'TEA PREPARATION', videoSrc: 'videos/tasks/03.mp4' },
    { index: '04', title: 'FOLDING CLOTHES', videoSrc: 'videos/tasks/04.mp4' },
    { index: '05', title: 'HANDLING TRAYS', videoSrc: 'videos/tasks/05.mp4' },
    /* 06 stays a placeholder until its clip exists */
    { index: '06', title: 'WORKPIECE PROCESSING', videoSrc: 'videos/tasks/06.mp4' },
  ],
}

/* ------------------------------------------------------------------ */
/* Research                                                            */
/* Page order: rendered between Activities (04) and Download (05)      */
/* ------------------------------------------------------------------ */

/**
 * English only.
 *
 * Titles, venues, years and URLs below are transcribed verbatim from the
 * project brief — do not paraphrase a title or invent an author list.
 * Adding a fourth paper means pushing one more object onto `papers`; the
 * layout (3 columns desktop / 2 tablet / 1 mobile) is rendered from the
 * array length, so nothing else needs to change.
 *
 * Every link opens in a new tab; the component applies
 * `target="_blank"` + `rel="noopener noreferrer"`.
 *
 * Shape of one paper:
 *   index       — ordinal drawn large and low-contrast above the title
 *   title       — full paper title, never abbreviated
 *   year        — e.g. '2026'
 *   venue       — e.g. 'SIGGRAPH', 'CVPR'
 *   venueNote   — parenthetical conference, e.g. '(SIGGRAPH Asia)'; '' drops it
 *                 (unused today: the conference name IS the venue)
 *   image       — teaser still shown between the venue line and the title,
 *                 relative (no leading "/") like every other asset on the
 *                 site. Source originals live in 图片素材\research and were
 *                 COPIED into public/images/research/ — the originals stay
 *                 untouched. All three are 16:9 (1568×882, 2310×1299,
 *                 1641×923), which is why the frame can be `aspect-video`
 *                 without ever cropping or distorting one of them.
 *   awards      — optional accent label lines, e.g. ['BEST PAPER AWARD',
 *                 'SIGGRAPH 2025']; [] drops the label entirely
 *   description — one paragraph, used as-is
 *   links       — [{ label, url }] rendered as uppercase mono links
 */
export const research = {
  /* Main title of the module */
  title: 'RESEARCH',

  /* One-line description under the title */
  description:
    'Research on wearable sensing, inertial motion capture, and human motion understanding.',

  /**
   * "More" button under the header copy — the only filled brand-blue control
   * on the page. Opens in a new tab (target/rel are set by the component).
   */
  more: { label: 'More', url: 'https://www.humanplus.xyz/' },

  papers: [
    {
      index: '01',
      title:
        'CLOTHO: Canonicalizing IMUs from Loose Inertial Garments for Accurate Human Motion Tracking',
      year: '2026',
      venue: 'SIGGRAPH Asia',
      venueNote: '',
      image: 'images/research/01.png',
      awards: [],
      description:
        'We introduce CLOTHO, an IMU canonicalization framework for garment-based inertial motion capture, achieving state-of-the-art accuracy, zero-shot generalization to unseen garments, and robust long-term tracking.',
      links: [{ label: 'Project', url: 'https://clotho-mocap.github.io/' }],
    },
    {
      index: '02',
      title:
        'Transformer IMU Calibrator: Dynamic On-body IMU Calibration for Inertial Motion Capture',
      year: '2025',
      venue: 'SIGGRAPH',
      venueNote: '',
      image: 'images/research/02.jpg',
      awards: ['Best Paper Award', 'SIGGRAPH 2025'],
      description:
        'We propose a novel dynamic calibration method for sparse inertial motion capture systems, which is the first to break the restrictive absolute static assumption in IMU calibration, the first to achieve implicit IMU calibration, as well as the first to enable long-term and accurate motion capture using sparse IMUs.',
      links: [
        { label: 'Project', url: 'https://www.humanplus.xyz/siggraph-2025-zcx' },
        { label: 'Paper', url: 'https://arxiv.org/pdf/2506.10580v1' },
        { label: 'Github', url: 'https://github.com/ZuoCX1996/TIC' },
      ],
    },
    {
      index: '03',
      title: 'Loose Inertial Poser: Motion Capture with IMU-attached Loose-Wear Jacket',
      year: '2024',
      venue: 'CVPR',
      venueNote: '',
      image: 'images/research/03.jpg',
      awards: [],
      description:
        'We introduce Loose Inertial Poser, a novel motion capture solution with high wearing comfortableness, by integrating four Inertial Measurement Units (IMUs) into a loose-wear jacket.',
      links: [
        { label: 'Project', url: 'https://www.humanplus.xyz/cvpr2024-zcx' },
        { label: 'Paper', url: 'https://ieeexplore.ieee.org/document/10657915' },
        { label: 'Github', url: 'https://github.com/ZuoCX1996/Loose-Inertial-Poser' },
      ],
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Products page                                                       */
/* ------------------------------------------------------------------ */

/**
 * Standalone /#/products page — two alternating image + info bands.
 *
 * English only: name, slogan and feature chips are all English, matching the
 * rest of the site. (Glove-0 was cut — product line is Motion-0 + Vision-0.)
 *
 * Assets live in public/images/products/ as transparent PNGs: the original
 * studio shots (light grey/white backdrops) were keyed out so the products
 * sit directly on the #0a0a0a page. Raw originals stay untouched in
 * 图片素材\Products.
 *
 *   `imageSrc` — relative path, e.g. 'images/products/motion-0.png'
 *   `videoSrc` — same idea for an MP4; wins over imageSrc when both are set
 *   neither    → the reserved box renders `placeholderLabel`
 *
 * ⚠️ The source folder's file numbers do NOT match the product order:
 *    01.png = the garment (Motion-0), 03.jpg = the head ring (Vision-0).
 *    Mapping below is by image content, not by file name.
 *
 * Once a real asset is set the frame styling disappears entirely (no border,
 * no fill) so the product shot blends straight into the page background.
 *
 * `halo: true` puts a very faint dark-grey radial behind the shot. Vision-0
 * is a black ring on a near-black page, so without it the silhouette
 * disappears — the halo lifts the ground just enough to read the outline
 * without becoming a visible panel.
 *
 * Copy shape is identical for both: ordinal → name → slogan → feature chips.
 * `features: []` would drop the chip row.
 *
 * `reverse: true` puts the visual on the right (and text on the left) on
 * desktop; on mobile every band falls back to image-above-text.
 */
export const products = {
  /* Hero */
  label: 'PRODUCTS',
  title: 'HumanPlus Capture System',
  description: 'Wearable interfaces for capturing human behavior in the real world.',

  items: [
    {
      index: '01',
      name: 'Motion-0',
      slogan: 'Full-Body Sensing, Effortless Capture',
      features: ['Comfortable Fit', '10H+ Battery', 'Washable'],
      /* Motion capture garment */
      imageSrc: 'images/products/motion-0.png',
      videoSrc: null,
      placeholderLabel: 'PRODUCT IMAGE',
      /* Full-width lifestyle banner rendered under this band (optional —
         omit the key and nothing renders). Same 4px radius as other media. */
      showcaseImage: 'images/products/motion-0-banner.jpg',
      showcaseAlt: 'Motion-0 garment worn in everyday kitchen scenes',
      halo: true,
      reverse: false,
    },
    {
      index: '02',
      name: 'Vision-0',
      slogan: 'First-Person Vision, Real-World Perception',
      features: ['Binocular Vision', 'Lightweight Design', 'Real-Time Capture'],
      /* Head-mounted dual-camera ring */
      imageSrc: 'images/products/vision-0.png',
      videoSrc: null,
      placeholderLabel: 'PRODUCT IMAGE',
      halo: true,
      reverse: true,
    },
  ],
}

/**
 * TECHNICAL SPECIFICATIONS — rendered on /#/products below the two bands.
 *
 * Structured arrays, never hand-written rows: a new parameter is one entry
 * in `rows`, and both tables share a single `SpecTable` component.
 *
 *   `accent: true` → the value is painted brand blue. Only the handful of
 *   headline numbers carries it (11-IMU, BNO085, 30 Hz, Up to 10 h /
 *   ICM-42688-P, 165°, 3840 × 1200, 30 fps); everything else stays white or
 *   silver so the blue reads as emphasis rather than decoration.
 *
 * Not a data grid with panels: rows are hairline-separated pairs (label →
 * value), stacked vertically — the two tables are NEVER side by side,
 * because Vision-0's parameter names are long and a split column would
 * squeeze them.
 */
export const productSpecs = {
  title: 'TECHNICAL SPECIFICATIONS',
  subtitle: 'Motion-0 & Vision-0',
  description: 'Core specifications of the HumanPlus Capture System.',

  /* Column captions — mono, uppercase, silver; no filled header row. */
  columns: {
    specification: 'SPECIFICATION',
    details: 'DETAILS',
  },

  tables: [
    {
      index: '01',
      name: 'MOTION-0',
      rows: [
        { label: 'Configuration', value: '11-IMU', accent: true },
        { label: 'IMU Sensor', value: 'BNO085', accent: true },
        { label: 'Sampling Rate', value: '30 Hz (Default)', accent: true },
        { label: 'Data Output', value: '3-Axis Acceleration, Quaternion' },
        {
          label: 'Communication & Synchronization',
          value: '2.4 GHz Wi-Fi / UDP; NTP ≤ 20 ms',
        },
        { label: 'Effective Range', value: 'Up to 20 m (Indoor)' },
        { label: 'Battery Life', value: 'Up to 10 h', accent: true },
      ],
    },
    {
      index: '02',
      name: 'VISION-0',
      rows: [
        { label: 'IMU Sensor', value: 'ICM-42688-P', accent: true },
        { label: 'Diagonal Field of View (FOV)', value: '165°', accent: true },
        { label: 'Binocular Resolution', value: '3840 × 1200', accent: true },
        { label: 'Frame Rate', value: '30 fps', accent: true },
        { label: 'Image Sensor', value: 'AR0234 (1/2.6")' },
        { label: 'Maximum Effective Resolution', value: '1920 (H) × 1200 (V)' },
        { label: 'Output Image Format', value: 'MJPEG / YUV2 (YUYV)' },
      ],
    },
  ],
}
