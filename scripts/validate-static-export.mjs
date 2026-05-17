import { createServer } from "node:http"
import { readFile, stat } from "node:fs/promises"
import path from "node:path"

const cwd = process.cwd()
const outDir = path.join(cwd, "out")
const sitemapFile = path.join(outDir, "sitemap.xml")

async function exists(p) {
  try {
    await stat(p)
    return true
  } catch {
    return false
  }
}

function toFilePathFromUrlPath(urlPath) {
  if (urlPath === "/") return path.join(outDir, "index.html")
  if (urlPath.endsWith("/")) return path.join(outDir, urlPath, "index.html")
  return path.join(outDir, urlPath)
}

function parseSitemap(xml) {
  const urls = []
  const re = /<loc>([^<]+)<\/loc>/g
  for (;;) {
    const m = re.exec(xml)
    if (!m) break
    urls.push(m[1])
  }
  return urls
}

function getPathFromUrl(loc) {
  const u = new URL(loc)
  return u.pathname
}

function contentTypeFor(p) {
  const ext = path.extname(p).toLowerCase()
  if (ext === ".html") return "text/html; charset=utf-8"
  if (ext === ".xml") return "application/xml; charset=utf-8"
  if (ext === ".txt") return "text/plain; charset=utf-8"
  if (ext === ".json") return "application/json; charset=utf-8"
  if (ext === ".css") return "text/css; charset=utf-8"
  if (ext === ".js") return "text/javascript; charset=utf-8"
  if (ext === ".map") return "application/json; charset=utf-8"
  if (ext === ".svg") return "image/svg+xml"
  if (ext === ".png") return "image/png"
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg"
  if (ext === ".webp") return "image/webp"
  if (ext === ".ico") return "image/x-icon"
  return "application/octet-stream"
}

async function readOutFile(urlPath) {
  const filePath = toFilePathFromUrlPath(urlPath)
  if (await exists(filePath)) {
    return { filePath, data: await readFile(filePath) }
  }

  if (!urlPath.endsWith("/") && !path.extname(urlPath)) {
    const withSlash = `${urlPath}/`
    const indexPath = toFilePathFromUrlPath(withSlash)
    if (await exists(indexPath)) {
      return { filePath: indexPath, data: await readFile(indexPath) }
    }
  }

  const fallback404 = path.join(outDir, "404.html")
  if (await exists(fallback404)) return { filePath: fallback404, data: await readFile(fallback404), status: 404 }
  return { filePath, data: Buffer.from("Not Found"), status: 404 }
}

async function validatePhysicalFiles(paths) {
  const missing = []
  for (const p of paths) {
    const filePath = toFilePathFromUrlPath(p)
    if (!(await exists(filePath))) missing.push({ path: p, filePath })
  }
  if (missing.length) {
    for (const m of missing) {
      console.error(`Missing export for ${m.path} -> ${m.filePath}`)
    }
    throw new Error(`Static export missing ${missing.length} file(s) referenced by sitemap`)
  }
}

async function validateHttp200(paths) {
  const server = createServer(async (req, res) => {
    const reqUrl = new URL(req.url ?? "/", "http://localhost")
    const urlPath = decodeURIComponent(reqUrl.pathname)
    try {
      const { data, filePath, status } = await readOutFile(urlPath)
      res.statusCode = status ?? 200
      res.setHeader("Content-Type", contentTypeFor(filePath))
      res.end(data)
    } catch (e) {
      res.statusCode = 500
      res.setHeader("Content-Type", "text/plain; charset=utf-8")
      res.end(e instanceof Error ? e.message : "Server error")
    }
  })

  await new Promise((resolve) => server.listen(0, resolve))
  const addr = server.address()
  if (!addr || typeof addr === "string") throw new Error("Failed to start validation server")
  const base = `http://127.0.0.1:${addr.port}`

  const failures = []
  for (const p of paths) {
    const res = await fetch(`${base}${p}`, { redirect: "manual" })
    if (res.status !== 200) failures.push({ path: p, status: res.status })
  }

  await new Promise((resolve) => server.close(resolve))

  if (failures.length) {
    for (const f of failures) {
      console.error(`Non-200 for ${f.path}: ${f.status}`)
    }
    throw new Error(`Static export HTTP validation failed for ${failures.length} path(s)`)
  }
}

async function main() {
  if (!(await exists(outDir))) throw new Error(`Missing out/ folder at ${outDir}. Run next build first.`)
  if (!(await exists(sitemapFile))) throw new Error(`Missing sitemap.xml at ${sitemapFile}.`)

  const xml = await readFile(sitemapFile, "utf8")
  const locs = parseSitemap(xml)
  if (!locs.length) throw new Error("sitemap.xml has no <loc> entries")

  const paths = locs.map(getPathFromUrl)

  await validatePhysicalFiles(paths)
  await validateHttp200(paths)

  const blogPaths = paths.filter((p) => p.startsWith("/blog/") && p !== "/blog/")
  if (!blogPaths.length) throw new Error("sitemap.xml contains no blog post URLs")
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
