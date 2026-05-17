import type { Metadata } from "next"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { JsonLd } from "@/components/JsonLd"

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common DV Lottery photo questions for applicants.",
  alternates: {
    canonical: "https://dvphotofix.netlify.app/faq/",
  },
  openGraph: {
    title: "DV Lottery FAQ — Photos, Rules, Tool",
    description: "Answers to common DV Lottery photo questions for applicants.",
    url: "https://dvphotofix.netlify.app/faq/",
  },
  twitter: {
    card: "summary_large_image",
    title: "DV Lottery FAQ — Photos, Rules, Tool",
    description: "Answers to common DV Lottery photo questions for applicants.",
  },
}

export default function FaqPage() {
  const faqs = [
    {
      q: "What is the DV Lottery?",
      a: "The Diversity Visa (DV) program is a U.S. Department of State program that offers a limited number of immigrant visas each year through a selection process. Always use the DV Program source pages for current rules and timelines.",
    },
    {
      q: "Is this site official?",
      a: "No. DV Photo Fix is an independent private-sector website and is not affiliated with the U.S. government.",
    },
    {
      q: "Is the DV Lottery entry free?",
      a: "Yes. The DV entry process is free. Be cautious of third parties who claim you must pay to enter.",
    },
    {
      q: "How many times can I apply?",
      a: "DV programs typically allow only one entry per person per registration period. Submitting more than one entry may disqualify you.",
    },
    {
      q: "What photo size is required for DV entry?",
      a: "DV entry photos are expected to be a square JPEG at 600×600 pixels and within the file size limit stated by the DV system.",
    },
    {
      q: "What file format is required?",
      a: "JPEG is the required digital format for DV entry photos.",
    },
    {
      q: "Can I use a phone photo?",
      a: "Yes, as long as it meets the DV photo requirements (lighting, background, framing, and technical specs). Many valid DV photos are taken with modern phones.",
    },
    {
      q: "Why was my DV photo rejected?",
      a: "Common reasons include wrong size/format, file too large, head not correctly framed, hair/chin clipped, shadows, busy background, or signs of heavy editing.",
    },
    {
      q: "Can I edit my DV photo?",
      a: "You can do safe formatting edits (crop, center, straighten, resize, compress) but should avoid any changes that alter your appearance. Final acceptance is decided by the official review process.",
    },
    {
      q: "Are glasses allowed?",
      a: "Glasses are generally not allowed in newer U.S. visa photo rules. If you are unsure, retake without glasses.",
    },
    {
      q: "Does the DV Photo Fix tool guarantee acceptance?",
      a: "No. The tool helps you format and frame a photo based on best-effort checks, but it cannot guarantee acceptance.",
    },
    {
      q: "Do you upload or store my photo?",
      a: "The tool is designed to process photos locally in your browser. Your image is not intended to be uploaded for the core checks and fixes.",
    },
    {
      q: "What does the tool change?",
      a: "Only safe transforms: crop, reframe/center, straighten (small tilt), resize to 600×600, and JPEG compression to meet file size limits.",
    },
    {
      q: "What does the tool NOT change?",
      a: "It does not beautify, retouch facial features, smooth skin, replace backgrounds, or generate missing details.",
    },
    {
      q: "How do I check DV results?",
      a: "DV results are checked through the DV Program system. Use the DV Program source pages and avoid lookalike sites.",
    },
    {
      q: "How do I know the latest DV registration dates?",
      a: "Dates are announced on the DV Program source pages. If the site does not list a date with a source link, treat it as unconfirmed.",
    },
    {
      q: "What if the tool says “issues detected”?",
      a: "Review the checklist and guides. If the issue is lighting/background or the original image is clipped, retaking the photo is often the correct fix.",
    },
  ] as const

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }

  return (
    <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-8">
      <JsonLd data={faqJsonLd} />
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">FAQ</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-slate-800">
        Fast answers aligned with DV Program guidance. This site is independent and not affiliated with the U.S.
        government.
      </p>

      <div className="mt-6">
        <Accordion type="single" collapsible>
          {faqs.map((f, idx) => (
            <AccordionItem key={f.q} value={`q${idx}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
