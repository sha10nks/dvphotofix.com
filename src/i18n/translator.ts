type Primitive = string | number | boolean | null | undefined

export type Messages = Record<string, unknown>

function getByPath(obj: unknown, path: string): unknown {
  const parts = path.split(".").filter(Boolean)
  let cur: unknown = obj
  for (const p of parts) {
    if (!cur || typeof cur !== "object") return undefined
    cur = (cur as Record<string, unknown>)[p]
  }
  return cur
}

function interpolate(template: string, values?: Record<string, Primitive>) {
  if (!values) return template
  return template.replace(/\{(\w+)\}/g, (_, k: string) => {
    const v = values[k]
    return v === undefined || v === null ? "" : String(v)
  })
}

export function createTranslator(allMessages: Record<string, Messages>) {
  function t(key: string, values?: Record<string, Primitive>) {
    const [ns, ...rest] = key.split(".")
    const messageKey = rest.join(".")
    const nsObj = allMessages[ns]
    const raw = nsObj ? getByPath(nsObj, messageKey) : undefined
    if (typeof raw === "string") return interpolate(raw, values)
    return key
  }

  function tn(namespace: string) {
    return (key: string, values?: Record<string, Primitive>) => t(`${namespace}.${key}`, values)
  }

  return { t, tn }
}
