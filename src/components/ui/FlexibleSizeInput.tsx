import { Dropdown, Textbox, Text, Muted, VerticalSpace } from "@create-figma-plugin/ui";
import { h, Fragment } from "preact";
import { useState, useEffect } from "preact/hooks";
import { PresetOption } from "../../config/presets";

interface FlexibleSizeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  presets: PresetOption[];
  unit?: string;
}

export function FlexibleSizeInput({ label, value, onChange, placeholder, presets, unit = "px" }: FlexibleSizeInputProps) {
  const [isCustom, setIsCustom] = useState(false);

  // Parse nilai saat ini untuk menentukan apakah itu preset
  const currentNumericValue = value ? Number(value.replace(/px/gi, "").trim()) : null;
  const currentPreset = currentNumericValue !== null ? presets.find(p => p.numericValue === currentNumericValue && p.value !== "custom") : null;

  const selectedPresetValue = currentPreset?.value || "custom";

  // Check apakah value saat ini adalah preset
  useEffect(() => {
    if (currentPreset && currentPreset.value !== "custom") {
      setIsCustom(false);
    } else if (value && value.trim() !== "") {
      setIsCustom(true);
    }
  }, [value, currentPreset]);

  const handlePresetChange = (presetValue: string) => {
    if (presetValue === "custom") {
      setIsCustom(true);
      // Tetap simpan value yang ada
    } else {
      setIsCustom(false);
      const preset = presets.find(p => p.value === presetValue);
      if (preset) {
        onChange(String(preset.numericValue));
      }
    }
  };

  const handleCustomChange = (customValue: string) => {
    onChange(customValue);
    // Auto-switch ke custom jika user mulai mengetik
    if (customValue && customValue.trim() !== "") {
      setIsCustom(true);
    }
  };

  return (
    <>
      <Text>
        <Muted>{label}</Muted>
      </Text>
      <VerticalSpace space="small" />

      {/* Dropdown Preset */}
      {!isCustom && (
        <>
          <Dropdown options={presets.map(p => ({ value: p.value, text: p.text }))} value={selectedPresetValue} onValueChange={handlePresetChange} />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11, color: "#666", fontStyle: "italic" }}>Atau klik "Custom..." untuk input bebas</Text>
        </>
      )}

      {/* Input Custom - selalu tersedia */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Textbox value={value} onValueInput={handleCustomChange} placeholder={placeholder || `Masukkan angka (${unit})`} style={{ flex: 1 }} />
        {unit && <Text style={{ fontSize: 12, color: "#666", minWidth: 24 }}>{unit}</Text>}
      </div>

      {/* Toggle kembali ke preset */}
      {isCustom && (
        <>
          <VerticalSpace space="small" />
          <button
            onClick={() => {
              setIsCustom(false);
              // Reset ke preset pertama jika value tidak match dengan preset
              if (!currentPreset || currentPreset.value === "custom") {
                const firstPreset = presets.find(p => p.value !== "custom");
                if (firstPreset) {
                  onChange(String(firstPreset.numericValue));
                }
              }
            }}
            style={{
              background: "none",
              border: "none",
              color: "#007AFF",
              fontSize: 11,
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            Gunakan preset
          </button>
        </>
      )}

      <VerticalSpace space="medium" />
    </>
  );
}
