// Parse nilai dengan unit px (piksel)
export function parsePx(value: string | undefined, defaultValue: number = 0): number {
  if (!value) return defaultValue;
  return Number(value.replace(/px/gi, "").trim()) || defaultValue;
}

// Parse nilai dengan unit ms (milliseconds)
export function parseMs(value: string | undefined, defaultValue: number = 0): number {
  if (!value) return defaultValue;
  return Number(value.replace(/ms/gi, "").trim()) || defaultValue;
}

// Parse nilai number biasa (tanpa unit)
export function parseNumber(value: string | undefined, defaultValue: number = 0): number {
  if (!value) return defaultValue;
  return Number(value.trim()) || defaultValue;
}
