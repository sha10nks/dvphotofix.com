export type BlogPost = {
  slug: string
  keyword: string
  title: string
  metaTitle: string
  metaDescription: string
  publishedISO: string
  content: string
  relatedSlugs: string[]
}

type Topic = {
  slug: string
  keyword: string
  title: string
  angle: string
  keyPoints: string[]
  mistakes: string[]
  checklist: string[]
}

function formatDateISO(d: Date) {
  const yyyy = d.getUTCFullYear()
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(d.getUTCDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

function toMetaTitle(title: string) {
  return title.length <= 60 ? title : `${title.slice(0, 57)}…`
}

function toMetaDescription(text: string) {
  const trimmed = text.replace(/\s+/g, " ").trim()
  return trimmed.length <= 155 ? trimmed : `${trimmed.slice(0, 152)}…`
}

function titleCase(s: string) {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ")
}

function ensureKeywordInTitle(keyword: string, title: string) {
  const k = keyword.toLowerCase()
  const t = title.toLowerCase()
  if (t.includes(k)) return title
  return `${titleCase(keyword)}: ${title}`
}

function renderArticle(args: {
  title: string
  keyword: string
  angle: string
  keyPoints: string[]
  mistakes: string[]
  checklist: string[]
  related: { title: string; href: string }
}) {
  const intro = `${args.keyword}: ${args.angle} If you need a fast, safe way to format and frame your image for DV entry, focus on specs (600×600 JPEG) and framing (centered, not clipped) before anything else.`

  const body = [
    intro,
    "",
    "## The fast answer",
    "For DV entry, get the technical requirements right first (JPEG, 600×600, within the file size limit). Then solve framing using face geometry: recenter left/right, place the eyes consistently, keep headroom above hair, and keep shoulders visible. Avoid any edit that changes appearance.",
    "",
    "## What to check (before you upload)",
    "Start with these checks on the exact file you plan to upload:",
    ...args.keyPoints.map((p) => `- ${p}`),
    "",
    "### Why these checks matter",
    "A photo can be rejected even if it looks good to you if its the wrong pixel size, if the face is not centered, or if the head is framed too tightly. The DV system is strict about technical formatting, and reviewers expect a natural-looking image with correct composition.",
    "",
    "## Common mistakes that trigger rejection",
    ...args.mistakes.map((m) => `- ${m}`),
    "",
    "### How to fix safely",
    "Use safe transforms only:",
    "- Crop and reframe (do not stretch)",
    "- Center the subject using the face/eyes, not guesses",
    "- Straighten only for small tilt",
    "- Resize to 600×600",
    "- Compress in small quality steps until you meet the size limit",
    "",
    "## Quick checklist",
    ...args.checklist.map((c) => `- ${c}`),
    "",
    "## Detailed breakdown (plain language)",
    "### 1) Technical specs",
    "Your DV entry image is a digital file. That means the upload system checks the file format (JPEG), the pixel dimensions (must be square and exactly 600×600), and the file size. If you resize but forget to export JPEG, or you export a 600×600 image thats still too large in kilobytes, the upload can fail or the entry may be flagged.",
    "",
    "### 2) Framing and composition",
    "Framing is about where your head and eyes land in the final 600×600 image. A simple center-crop often fails when the person is off-axis in the original photo, or when the original is taken too close/too far. A correct approach is: detect face and eyes, scale the image so the head is the right size, then position the subject so the face is centered and there is safe headroom above hair.",
    "",
    "### 3) Background and lighting",
    "Background and lighting problems are usually better solved by retaking the photo. Edits that attempt to repaint a background can make the image look manipulated. The safest setup is a plain light background and soft light from the front so you dont get a dark shadow behind your head.",
    "",
    "## What the tool can do",
    "DV Photo Fix is built as a framing engine: it detects the face, scales the image so the head is the correct size, positions the eyes in a consistent vertical zone, and keeps headroom so hair doesnt touch the top border. It then exports a 600×600 JPEG and compresses gently to meet the file size target.",
    "",
    "## What the tool will not do",
    "It will not beautify, retouch facial features, smooth skin, replace backgrounds, or generate missing image details. If a photo is truly unusable (clipped hair, harsh shadows, busy background), retaking the photo is usually the correct fix.",
    "",
    "## Source and safety notes",
    "This website is not affiliated with the U.S. government. The DV Program source pages are the only source of truth for requirements and timelines. This content is written to be concise and practical, and to help you avoid the most common photo formatting and framing mistakes.",
    "",
    "## What to do next",
    `- Open the tool to reframe and format your photo safely: [DV photo tool](/tool)`,
    `- Review the full requirements page: [Photo requirements](/photo-requirements)`,
    `- Read next: [${args.related.title}](${args.related.href})`,
  ]

  return body.join("\n")
}

const TOPICS: Topic[] = [
  {
    slug: "dv-lottery-photo-requirements",
    keyword: "dv lottery photo requirements",
    title: "DV Lottery Photo Requirements (Size, Format, Framing)",
    angle: "The DV photo must meet strict technical specs and framing rules.",
    keyPoints: [
      "JPEG digital image for DV entry",
      "Square output at 600×600 pixels",
      "File size within the DV system limit (commonly 240 kB)",
      "Head centered with visible headroom and shoulders",
      "Plain light background and even lighting",
    ],
    mistakes: [
      "Uploading a non-square image or the wrong pixel size",
      "Over-compressing until the face looks blurry",
      "Head too small (too far) or too large (too close)",
      "Hair/chin clipped by a tight crop",
      "Busy background or strong shadows",
    ],
    checklist: [
      "600×600 square JPEG",
      "Face centered left/right",
      "Eyes placed consistently (not too low)",
      "Full head visible with top space",
      "File size checked before upload",
    ],
  },
  {
    slug: "dv-photo-size-600x600",
    keyword: "dv photo size 600x600",
    title: "DV Photo Size 600x600: What It Means and How to Fix It",
    angle: "600×600 refers to pixels, not inches, and the system checks it exactly.",
    keyPoints: [
      "Pixels must be exactly 600×600",
      "Square crop must be done before final resize",
      "Avoid stretching (distortion)",
      "Reframe first if your head becomes too small/large",
      "Export as JPEG and verify file size",
    ],
    mistakes: [
      "Uploading 600×800 or any non-square image",
      "Resizing without reframing (face ends up off-center)",
      "Using a screenshot or compressed messenger image",
      "Letting software auto-stretch to fit 600×600",
      "Forgetting to re-check the final JPEG size",
    ],
    checklist: [
      "Square crop, then resize to 600×600",
      "No stretching; keep natural proportions",
      "Face stays centered after resize",
      "JPEG output",
      "Confirm final file size",
    ],
  },
  {
    slug: "dv-photo-checker",
    keyword: "dv photo checker",
    title: "DV Photo Checker: What It Can and Cannot Tell You",
    angle: "A checker can validate size and framing, but it cannot guarantee acceptance.",
    keyPoints: [
      "Check pixel size, aspect ratio, and file size",
      "Check framing using face position (center + headroom)",
      "Warn on tilt and likely shadow issues",
      "Keep edits limited to safe formatting",
      "Verify against DV Program source pages",
    ],
    mistakes: [
      "Assuming a green check means guaranteed acceptance",
      "Relying on heavy background edits",
      "Ignoring glare/shadows that the tool cannot fix",
      "Using a low-resolution or heavily compressed original",
      "Uploading multiple entries (non-photo mistake that still matters)",
    ],
    checklist: [
      "Run checks on the final JPEG you will upload",
      "Confirm 600×600 and size limit",
      "Confirm face is centered and not clipped",
      "Retake if lighting/background is bad",
      "Use DV Program pages for final confirmation",
    ],
  },
]

const EXTRA_TOPICS: Topic[] = [
  {
    slug: "why-dv-photo-rejected",
    keyword: "why dv lottery photo rejected",
    title: "Why DV Lottery Photos Get Rejected (And How to Fix Each Issue)",
    angle: "Most rejections come from technical specs, framing, or lighting/background problems.",
    keyPoints: [
      "Start with size/format: 600×600 JPEG",
      "Then check file size and compression quality",
      "Then check framing (head size + headroom)",
      "Then check background and shadows",
      "Avoid edits that change appearance",
    ],
    mistakes: [
      "Cropping too tight and cutting hair",
      "Face not centered left/right",
      "Head too small after resizing",
      "File size too large or too compressed",
      "Busy background",
    ],
    checklist: [
      "Fix size/format first",
      "Reframe using the eyes as the anchor",
      "Keep shoulders visible",
      "Compress gently",
      "Retake if the original is clipped",
    ],
  },
  {
    slug: "dv-photo-background-requirements",
    keyword: "dv photo background requirements",
    title: "DV Photo Background Requirements: What Works and What Fails",
    angle: "A plain light background with even lighting is the safest choice.",
    keyPoints: [
      "Use a plain white/off-white background",
      "Avoid texture, patterns, and strong gradients",
      "Avoid shadows behind the head",
      "Keep the background consistent across the full frame",
      "Retake instead of trying to replace the background",
    ],
    mistakes: [
      "Using a wall with visible texture",
      "Standing too close and creating a shadow",
      "Using a colorful background",
      "Over-editing the background",
      "Using portrait mode blur",
    ],
    checklist: [
      "Plain light wall or sheet",
      "Step away from the background",
      "Front-facing light",
      "No background replacement",
      "Check the final JPEG",
    ],
  },
]

const MORE_TOPICS: Topic[] = [
  {
    slug: "dv-photo-lighting-mistakes",
    keyword: "dv photo lighting mistakes",
    title: "DV Photo Lighting Mistakes That Cause Rejection",
    angle: "Harsh shadows and uneven light are common failures.",
    keyPoints: [
      "Even light on the face",
      "No strong shadows on the background",
      "Avoid flash glare",
      "Avoid backlighting",
      "Retake if lighting is poor",
    ],
    mistakes: [
      "Strong shadow line on the face",
      "Flash hotspot on forehead",
      "Backlit window behind you",
      "Mixed light sources (different colors)",
      "Dark background",
    ],
    checklist: [
      "Face a window or soft light",
      "No hard shadows",
      "No flash glare",
      "Neutral background",
      "Recheck after export",
    ],
  },
]

const TOPIC_POOL: Topic[] = [
  ...TOPICS,
  ...EXTRA_TOPICS,
  ...MORE_TOPICS,
  {
    slug: "dv-photo-head-size-ratio",
    keyword: "dv photo head size ratio",
    title: "DV Photo Head Size Ratio: Too Close vs Too Far",
    angle: "Head size is about framing: your head must occupy an acceptable portion of the image.",
    keyPoints: [
      "Head not too small (too far) and not too large (too close)",
      "Keep top headroom",
      "Keep upper shoulders visible",
      "Scale and reframe before final crop",
      "Retake if the original is clipped",
    ],
    mistakes: [
      "Face-only crop",
      "Shoulders removed",
      "Hair touching the top border",
      "Chin too close to the bottom",
      "Resizing without reframing",
    ],
    checklist: [
      "Head fits comfortably with margins",
      "Eyes land in a consistent vertical zone",
      "Shoulders show",
      "No clipping",
      "Final JPEG verified",
    ],
  },
]

const FILLER_SLUGS = [
  "dv-photo-glasses-rule",
  "can-i-use-phone-photo-dv",
  "dv-photo-file-size-240kb",
  "dv-photo-jpeg-format",
  "dv-photo-crop-and-center",
  "dv-entry-is-free",
  "one-entry-per-person-dv",
  "how-to-check-dv-results",
  "dv-lottery-scam-warning",
  "dv-photo-at-home",
  "dv-photo-too-small-fix",
  "dv-photo-too-large-fix",
  "dv-photo-headroom",
  "dv-photo-neutral-expression",
  "dv-photo-editing-allowed",
  "dv-photo-shadow-behind-head",
  "dv-photo-background-color",
  "dv-photo-background-texture",
  "dv-photo-iphone",
  "dv-photo-android",
  "dv-photo-hijab",
  "dv-photo-head-covering",
  "dv-photo-uniform",
  "dv-photo-smile",
  "dv-lottery-entry-mistakes",
  "dv-confirmation-number-help",
  "dv-lottery-deadline-updates",
  "dv-status-check-not-working",
  "dv-photo-tool-privacy",
  "dv-photo-resolution-vs-size",
  "dv-photo-common-rejection-reasons",
  "dv-photo-composition-examples",
  "dv-photo-shoulders-visible",
  "dv-photo-straighten-tilt",
  "dv-photo-background-shadows",
  "dv-photo-correct-framing",
  "dv-photo-reframe-engine",
  "dv-photo-600x600-compress",
  "dv-photo-check-before-upload",
  "dv-photo-why-blurry",
  "dv-photo-quality-tips",
  "dv-photo-metadata",
  "dv-photo-what-not-to-edit",
  "dv-photo-safe-edits-only",
  "dv-photo-export-jpeg",
  "dv-photo-upload-errors",
  "dv-photo-file-too-large",
  "dv-photo-file-too-small",
  "dv-photo-wrong-aspect-ratio",
  "dv-photo-wrong-size",
  "dv-photo-not-jpeg",
  "dv-photo-background-shadow-fix",
  "dv-photo-face-not-centered",
  "dv-photo-tilt-angle",
  "dv-photo-head-too-close",
  "dv-photo-head-too-far",
  "dv-photo-low-resolution",
  "dv-photo-compression-artifacts",
  "dv-photo-over-edited",
  "dv-photo-background-replacement-risk",
  "dv-photo-how-to-crop-600x600",
  "dv-photo-how-to-compress-240kb",
  "dv-photo-best-camera-settings",
  "dv-photo-indoor-lighting",
  "dv-photo-window-lighting",
  "dv-photo-plain-background-setup",
  "dv-photo-shoulders-cut-off",
  "dv-photo-hair-clipped",
  "dv-photo-chin-cut-off",
  "dv-photo-what-if-face-detection-fails",
]

function makeGenericTopic(slug: string): Topic {
  const keyword = slug.replace(/-/g, " ")
  const title = titleCase(keyword)

  return {
    slug,
    keyword,
    title,
    angle: "Heres what the rule means and how to solve it quickly without risky edits.",
    keyPoints: [
      "Use a 600×600 square JPEG",
      "Keep framing centered and natural",
      "Avoid edits that change appearance",
      "Retake if lighting/background is poor",
      "Verify using DV Program source pages",
    ],
    mistakes: [
      "Wrong size or aspect ratio",
      "Hair/chin clipped",
      "Over-compression causing blur",
      "Shadows or uneven background",
      "Off-center framing",
    ],
    checklist: [
      "Export JPEG at 600×600",
      "Check file size",
      "Center the face",
      "Keep headroom and shoulders",
      "Use the tool for safe fixes",
    ],
  }
}

const ALL_TOPICS: Topic[] = (() => {
  const map = new Map<string, Topic>()
  for (const t of TOPIC_POOL) map.set(t.slug, t)
  for (const slug of FILLER_SLUGS) {
    if (!map.has(slug)) map.set(slug, makeGenericTopic(slug))
  }
  return Array.from(map.values()).slice(0, 70)
})()

export const blogPosts: BlogPost[] = (() => {
  const today = new Date()
  return ALL_TOPICS.map((t, idx) => {
    const related = ALL_TOPICS[(idx + 1) % ALL_TOPICS.length]
    const publishedISO = formatDateISO(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), Math.max(1, today.getUTCDate() - idx))))
    const title = ensureKeywordInTitle(t.keyword, t.title)
    const content = renderArticle({
      title,
      keyword: t.keyword,
      angle: t.angle,
      keyPoints: t.keyPoints,
      mistakes: t.mistakes,
      checklist: t.checklist,
      related: { title: related.title, href: `/blog/${related.slug}` },
    })
    const metaTitle = toMetaTitle(`${title} | DV Photo Fix`)
    const metaDescription = toMetaDescription(
      `${t.keyword}: ${t.angle} Includes a quick checklist and what to do next, plus a direct link to the photo tool.
      `,
    )

    return {
      slug: t.slug,
      keyword: t.keyword,
      title,
      metaTitle,
      metaDescription,
      publishedISO,
      content,
      relatedSlugs: [related.slug],
    }
  })
})()

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug) ?? null
}
