function clamp(value: number) {
  return Math.min(255, Math.max(0, value));
}

function normalizeHex(hex: string) {
  return hex.replace("#", "");
}

function parseHex(hex: string) {
  const normalized = normalizeHex(hex);

  if (normalized.length !== 6) {
    return [0, 117, 222] as const;
  }

  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ] as const;
}

export function mixHexColor(source: string, target: string, amount: number) {
  const [sourceRed, sourceGreen, sourceBlue] = parseHex(source);
  const [targetRed, targetGreen, targetBlue] = parseHex(target);
  const weight = Math.min(1, Math.max(0, amount));

  const mixedRed = clamp(Math.round(sourceRed + (targetRed - sourceRed) * weight));
  const mixedGreen = clamp(Math.round(sourceGreen + (targetGreen - sourceGreen) * weight));
  const mixedBlue = clamp(Math.round(sourceBlue + (targetBlue - sourceBlue) * weight));

  return `#${[mixedRed, mixedGreen, mixedBlue]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

export function withAlpha(hex: string, alpha: number) {
  const normalizedAlpha = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");

  return `${hex}${normalizedAlpha}`;
}

export function getDailySwatchSurface(color: string, isDarkMode: boolean) {
  return withAlpha(color, isDarkMode ? 0.18 : 0.12);
}

export function getDailyIconTone(color: string, isDarkMode: boolean) {
  return isDarkMode ? mixHexColor(color, "#ffffff", 0.34) : mixHexColor(color, "#000000", 0.22);
}
