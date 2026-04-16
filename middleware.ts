import createMiddleware from "next-intl/middleware"

import { routing } from "./src/i18n/routing"

export default createMiddleware(routing)

export const config = {
  matcher: ["/", "/(ar|en|es|fr|ru|tr|fa|pt)/:path*"],
}

