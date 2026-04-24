import { useTranslations } from "next-intl"
import { Camera, ShieldCheck } from "lucide-react"

import { Link } from "@/i18n/navigation"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const tNav = useTranslations("nav")

  return (
    <header className="sticky top-0 z-40 w-full border-b border-blue-900/10 bg-blue-900 text-white">
      <div className="mx-auto flex max-w-[1300px] items-center gap-4 px-6 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
            <Camera className="h-4 w-4" />
          </div>
          <span>DV Photo Fix</span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          <Link href="/tool/" className="text-sm text-blue-50 hover:text-white">
            {tNav("tool")}
          </Link>
          <Link href="/photo-requirements" className="text-sm text-blue-50 hover:text-white">
            {tNav("requirements")}
          </Link>
          <Link href="/faq" className="text-sm text-blue-50 hover:text-white">
            {tNav("faq")}
          </Link>
          <Link href="/updates" className="text-sm text-blue-50 hover:text-white">
            {tNav("updates")}
          </Link>
          <Link href="/blog" className="text-sm text-blue-50 hover:text-white">
            {tNav("blog")}
          </Link>
        </nav>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <Button asChild variant="secondary" size="sm">
            <Link href="/tool/" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              {tNav("tool")}
            </Link>
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <Button asChild variant="secondary" size="icon" aria-label={tNav("tool")}>
            <Link href="/tool/">
              <ShieldCheck className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
