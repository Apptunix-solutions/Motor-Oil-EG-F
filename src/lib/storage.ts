import type { z } from 'zod'

export function readStored<T>(key: string, schema: z.ZodType<T>, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    const result = schema.safeParse(JSON.parse(raw))
    if (result.success) return result.data
    localStorage.removeItem(key)
  } catch {
    // Corrupt JSON or storage blocked (e.g. Safari private mode): start fresh.
    removeStored(key)
  }
  return fallback
}

export function writeStored(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Quota exceeded or storage blocked; keep in-memory state only.
  }
}

export function removeStored(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Storage unavailable.
  }
}
