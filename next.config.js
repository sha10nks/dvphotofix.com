const withNextIntl = require("next-intl/plugin")()

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = withNextIntl(nextConfig)
