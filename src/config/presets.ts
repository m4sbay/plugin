export interface PresetOption {
  value: string;
  text: string;
  numericValue: number;
}

export const SIZE_PRESETS: PresetOption[] = [
  { value: "xs", text: "XS (12px)", numericValue: 12 },
  { value: "sm", text: "SM (14px)", numericValue: 14 },
  { value: "md", text: "MD (16px)", numericValue: 16 },
  { value: "lg", text: "LG (18px)", numericValue: 18 },
  { value: "xl", text: "XL (20px)", numericValue: 20 },
  { value: "custom", text: "Custom...", numericValue: 0 },
];

export const BORDER_RADIUS_PRESETS: PresetOption[] = [
  { value: "none", text: "None (0px)", numericValue: 0 },
  { value: "sm", text: "Small (4px)", numericValue: 4 },
  { value: "md", text: "Medium (8px)", numericValue: 8 },
  { value: "lg", text: "Large (12px)", numericValue: 12 },
  { value: "xl", text: "XL (16px)", numericValue: 16 },
  { value: "custom", text: "Custom...", numericValue: 0 },
];

export const PADDING_PRESETS: PresetOption[] = [
  { value: "xs", text: "XS (4px)", numericValue: 4 },
  { value: "sm", text: "SM (8px)", numericValue: 8 },
  { value: "md", text: "MD (12px)", numericValue: 12 },
  { value: "lg", text: "LG (16px)", numericValue: 16 },
  { value: "xl", text: "XL (24px)", numericValue: 24 },
  { value: "custom", text: "Custom...", numericValue: 0 },
];

export const BORDER_WIDTH_PRESETS: PresetOption[] = [
  { value: "none", text: "None (0px)", numericValue: 0 },
  { value: "thin", text: "Thin (1px)", numericValue: 1 },
  { value: "md", text: "Medium (2px)", numericValue: 2 },
  { value: "thick", text: "Thick (4px)", numericValue: 4 },
  { value: "custom", text: "Custom...", numericValue: 0 },
];

export const GAP_PRESETS: PresetOption[] = [
  { value: "xs", text: "XS (4px)", numericValue: 4 },
  { value: "sm", text: "SM (8px)", numericValue: 8 },
  { value: "md", text: "MD (12px)", numericValue: 12 },
  { value: "lg", text: "LG (16px)", numericValue: 16 },
  { value: "xl", text: "XL (24px)", numericValue: 24 },
  { value: "custom", text: "Custom...", numericValue: 0 },
];

// Preset khusus untuk fontSize kecil (seperti tooltip)
export const SMALL_FONT_SIZE_PRESETS: PresetOption[] = [
  { value: "xs", text: "XS (10px)", numericValue: 10 },
  { value: "sm", text: "SM (12px)", numericValue: 12 },
  { value: "md", text: "MD (14px)", numericValue: 14 },
  { value: "lg", text: "LG (16px)", numericValue: 16 },
  { value: "xl", text: "XL (18px)", numericValue: 18 },
  { value: "custom", text: "Custom...", numericValue: 0 },
];

// Preset khusus untuk padding kecil (seperti tooltip)
export const SMALL_PADDING_PRESETS: PresetOption[] = [
  { value: "xs", text: "XS (4px)", numericValue: 4 },
  { value: "sm", text: "SM (6px)", numericValue: 6 },
  { value: "md", text: "MD (8px)", numericValue: 8 },
  { value: "lg", text: "LG (12px)", numericValue: 12 },
  { value: "xl", text: "XL (16px)", numericValue: 16 },
  { value: "custom", text: "Custom...", numericValue: 0 },
];

// Preset khusus untuk borderRadius kecil
export const SMALL_BORDER_RADIUS_PRESETS: PresetOption[] = [
  { value: "none", text: "None (0px)", numericValue: 0 },
  { value: "sm", text: "Small (4px)", numericValue: 4 },
  { value: "md", text: "Medium (6px)", numericValue: 6 },
  { value: "lg", text: "Large (8px)", numericValue: 8 },
  { value: "xl", text: "XL (12px)", numericValue: 12 },
  { value: "custom", text: "Custom...", numericValue: 0 },
];
