import type { Metadata } from "next"

import { Link } from "@/i18n/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact DV Photo Fix for support or legal requests.",
  alternates: {
    canonical: "https://dvphotofix.netlify.app/contact",
  },
  openGraph: {
    title: "Contact",
    description: "Contact DV Photo Fix for support or legal requests.",
    url: "https://dvphotofix.netlify.app/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact",
    description: "Contact DV Photo Fix for support or legal requests.",
  },
}

export default function ContactPage({ searchParams }: { searchParams?: { success?: string } }) {
  const success = searchParams?.success === "1"
  return (
    <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Contact</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-slate-800">
        Send a message for support or legal requests. For DV entry questions, use the tool and requirements pages first.
      </p>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-[15px] leading-7 text-slate-800">
            {success ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                Thanks  your message was sent.
              </div>
            ) : null}

            <form name="contact" method="POST" action="?success=1" data-netlify="true" data-netlify-honeypot="bot-field">
              <input type="hidden" name="form-name" value="contact" />
              <p className="hidden">
                <label>
                  Dont fill this out: <input name="bot-field" />
                </label>
              </p>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-[15px] font-medium text-slate-900" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    className="flex h-[44px] w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-[15px] text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-[15px] font-medium text-slate-900" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    required
                    className="flex h-[44px] w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-[15px] text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    placeholder="name@example.com"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-[15px] font-medium text-slate-900" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    placeholder="How can we help?"
                  />
                </div>

                <button className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-8 text-base font-medium text-white shadow-sm hover:bg-blue-800">
                  Send message
                </button>
              </div>
            </form>

            <div className="text-sm text-slate-700">
              Prefer email? —
              <a className="font-medium text-blue-700 hover:text-blue-800" href="mailto:support@dvphotofix.netlify.app">
                support@dvphotofix.netlify.app
              </a>
            </div>

            <div className="text-sm text-slate-700">
              Helpful links: <Link className="font-medium text-blue-700 hover:text-blue-800" href="/tool">Tool</Link> ·
              <Link className="font-medium text-blue-700 hover:text-blue-800" href="/photo-requirements">Photo requirements</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
