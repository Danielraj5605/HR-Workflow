// src/utils/nanoid.ts
// Lightweight inline ID generator — no external package required.
// Format: 7 base-36 chars (random) + base-36 timestamp suffix

export function nanoid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}
