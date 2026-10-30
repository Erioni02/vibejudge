/**
 * ─────────────────────────────────────────────────────────────
 *  MOTIONSITES PROMO — single source of truth
 *  Edit timing, colors, copy, links and audio here.
 * ─────────────────────────────────────────────────────────────
 */

export const VIDEO = {
  fps: 30,
  durationInFrames: 900, // 30s
  landscape: {width: 1920, height: 1080},
  portrait: {width: 1080, height: 1920},
} as const;

/** Scene timing in frames (30fps). Must add up to VIDEO.durationInFrames. */
export const TIMING = {
  hook: 90, //     0–3s
  problem: 150, // 3–8s
  reveal: 180, //  8–14s
  how: 240, //     14–22s
  proof: 150, //   22–27s
  cta: 90, //      27–30s
  /** Frames each scene fades in/out over (overlaps neighbours visually). */
  fade: 10,
  /** Inside the "how it works" scene: when the steps hand over to the browser mock. */
  howBrowserAt: 128,
  /** Inside the proof scene: frames each mock hero holds before the next slides in. */
  proofBeat: 26,
} as const;

export const COLORS = {
  bg: '#05050A',
  bgElevated: '#0D0D16',
  surface: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.09)',
  text: '#F4F4F8',
  textMuted: '#9A9AAE',
  /** The flat "generic" grey used in the hook/problem scenes. */
  generic: '#5B5B66',
  genericLine: '#3A3A44',
  accentFrom: '#8B5CF6', // violet
  accentTo: '#22D3EE', //   cyan
  glow: 'rgba(139,92,246,0.55)',
} as const;

export const ACCENT_GRADIENT = `linear-gradient(100deg, ${COLORS.accentFrom} 0%, ${COLORS.accentTo} 100%)`;

export const STYLE = {
  /** Film grain strength 0–1. */
  grain: 0.07,
  /** Camera push-in per scene (1.04 = 4% zoom across the scene). */
  pushIn: 1.045,
  headlineTracking: '-0.045em',
} as const;

export const COPY = {
  hook: {
    words: ['Most', 'AI-built', 'websites', 'look', 'the', 'same.'],
    /** How many of the last words glitch into flat grey. */
    glitchLastWords: 3,
  },
  problem: {
    lines: ['Generic prompts.', 'Generic design.'],
  },
  reveal: {
    wordmark: 'MotionSites',
    sublines: ['Premium hero section prompts.', 'Animated. Ready to paste.'],
  },
  how: {
    steps: [
      {title: 'Pick a template', icon: 'template'},
      {title: 'Copy the prompt', icon: 'copy'},
      {title: 'Paste into your AI builder', icon: 'paste'},
    ],
    chips: ['SaaS', 'Agency', 'Portfolio', 'Landing Page'],
    promptSnippet: 'Create a hero section with a slow violet-to-cyan gradient…',
    tools: ['Lovable', 'Cursor', 'Claude'],
    browserUrl: 'yoursite.app',
    mockHeadline: 'Launch something beautiful.',
    mockSub: 'An animated hero, built from one prompt.',
    mockCta: 'Get started',
  },
  proof: {
    overlay: ['Animated backgrounds. Motion effects.', 'Real results from the first prompt.'],
  },
  cta: {
    headline: 'Build your animated site today.',
    url: 'motionsites.ai',
    /** ← Put your affiliate link or code here. */
    affiliate: '[MY AFFILIATE LINK / CODE]',
    disclosure: 'Affiliate link. I may earn a commission.',
  },
} as const;

/**
 * AUDIO — every file is optional. Drop files into /public and they're picked up
 * automatically; missing files are skipped (no crash).
 */
export const AUDIO = {
  music: {
    file: 'music.mp3',
    volume: 0.55,
    /** Music volume while the voiceover is present. */
    volumeUnderVoice: 0.22,
    fadeInFrames: 30,
    fadeOutFrames: 45,
  },
  sfx: {
    volume: 0.5,
    /** Absolute frames. Files are looked up in /public/sfx/. */
    cues: [
      {frame: 88, file: 'sfx/whoosh.mp3'},
      {frame: 238, file: 'sfx/whoosh.mp3'},
      {frame: 252, file: 'sfx/pop.mp3'},
      {frame: 418, file: 'sfx/whoosh.mp3'},
      {frame: 548, file: 'sfx/pop.mp3'},
      {frame: 658, file: 'sfx/whoosh.mp3'},
      {frame: 808, file: 'sfx/whoosh.mp3'},
      {frame: 830, file: 'sfx/pop.mp3'},
    ],
  },
} as const;

/**
 * VOICEOVER — generated with tts.ai via `npm run voiceover`.
 * Each line becomes public/voiceover/<id>.mp3 and plays at `from` (absolute frame).
 * Keep each line shorter than the gap to the next one.
 * `spoken` lets you write the pronunciation separately from the on-screen copy.
 */
export const VOICEOVER = {
  volume: 1,
  tts: {
    model: 'kokoro',
    voice: 'am_michael',
    speed: 1.05,
    format: 'mp3',
  },
  lines: [
    {id: '01-hook', from: 6, text: 'Most AI-built websites look the same.'},
    {id: '02-problem', from: 112, text: 'Generic prompts give you generic design.'},
    {id: '03-reveal', from: 248, text: 'Meet MotionSites. Premium hero section prompts. Animated, and ready to paste.'},
    {id: '04-how', from: 440, text: 'Pick a template. Copy the prompt. Paste it into Lovable, Cursor, or Claude.'},
    {id: '05-proof', from: 660, text: 'Animated backgrounds and motion effects, from the very first prompt.'},
    {id: '06-cta', from: 810, text: 'Build yours at motionsites dot A I.'},
  ],
} as const;

/** Screen-recording slot for scene 4 — drop public/demo.mp4 in to replace the mock browser. */
export const DEMO = {
  file: 'demo.mp4',
  /** Start offset into the recording, in seconds. */
  startFromSeconds: 0,
} as const;
