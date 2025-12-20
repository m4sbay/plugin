// Mapping font weight ke Figma font style
// Mapping sesuai Tailwind CSS: 100=Thin, 200=Extra Light, 300=Light, 400=Regular, 500=Medium, 600=Semi Bold, 700=Bold, 800=Extra Bold, 900=Black
export function getFontStyle(weight: number | string): string {
  const weightNum = Number(weight);
  if (weightNum <= 100) return "Thin";
  if (weightNum <= 200) return "Extra Light";
  if (weightNum <= 300) return "Light";
  if (weightNum <= 400) return "Regular";
  if (weightNum <= 500) return "Medium";
  if (weightNum <= 600) return "Semi Bold";
  if (weightNum <= 700) return "Bold";
  if (weightNum <= 800) return "Extra Bold";
  return "Black"; // 900
}

// Load font Inter dengan style tertentu
export async function loadInterFonts(styles: string[]): Promise<void> {
  try {
    await Promise.all(styles.map(style => figma.loadFontAsync({ family: "Inter", style })));
  } catch (error) {
    throw new Error(`Gagal memuat font 'Inter': ${error}`);
  }
}

// Load semua font Inter style
export async function loadAllInterFonts(): Promise<void> {
  const styles = ["Thin", "Extra Light", "Light", "Regular", "Medium", "Semi Bold", "Bold", "Extra Bold", "Black"];
  await loadInterFonts(styles);
}
