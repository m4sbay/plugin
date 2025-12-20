// Konversi hex color ke RGB format Figma
// Menggabungkan fungsi customConvertHexColorToRgbColor dan hexToRgb yang ada
// Return default black jika hex tidak valid
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  if (!hex) return { r: 0, g: 0, b: 0 };
  
  let cleanHex = hex.trim().toUpperCase();
  
  // Pastikan ada # di depan
  if (!cleanHex.startsWith("#")) {
    cleanHex = `#${cleanHex}`;
  }
  
  // Handle 3-digit hex (contoh: #FFF -> #FFFFFF)
  let c = cleanHex.replace("#", "");
  if (c.length === 3) {
    c = c
      .split("")
      .map(x => x + x)
      .join("");
  }
  
  // Validasi format hex 6 digit, return default jika tidak valid
  if (!/^[0-9A-F]{6}$/.test(c)) {
    console.log(`Invalid hex format: ${cleanHex}, using default black`);
    return { r: 0, g: 0, b: 0 };
  }
  
  const num = parseInt(c, 16);
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
  };
}

// Versi yang bisa return null untuk validasi (backward compatibility)
export function hexToRgbOrNull(hex: string): { r: number; g: number; b: number } | null {
  if (!hex) return null;
  
  let cleanHex = hex.trim().toUpperCase();
  if (!cleanHex.startsWith("#")) {
    cleanHex = `#${cleanHex}`;
  }
  
  let c = cleanHex.replace("#", "");
  if (c.length === 3) {
    c = c
      .split("")
      .map(x => x + x)
      .join("");
  }
  
  if (!/^[0-9A-F]{6}$/.test(c)) {
    return null;
  }
  
  const num = parseInt(c, 16);
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
  };
}

// Normalisasi hex color (pastikan ada # di depan dan uppercase)
export function normalizeHex(color: string): string {
  if (!color) return "#000000";
  const cleanColor = color.replace("#", "").toUpperCase();
  return `#${cleanColor}`;
}

