import { Muted, Text, TextboxColor, VerticalSpace } from "@create-figma-plugin/ui";
import { h, Fragment } from "preact";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  error?: string;
}

function normalizeHex(value: string): string {
  if (!value) return value;
  return value.startsWith("#") ? value : `#${value}`;
}

export function ColorPicker({ label, value, onChange, error }: ColorPickerProps) {
  const handleHexColorValueInput = (newHex: string) => {
    onChange(normalizeHex(newHex));
  };

  const hexColor = value ? value.replace(/^#/, "") : "";
  const displayHexColor = hexColor || "000000";

  return (
    <>
      <Text>
        <Muted>{label}</Muted>
      </Text>
      <VerticalSpace space="small" />
      <TextboxColor hexColor={displayHexColor} opacity="100" onHexColorValueInput={handleHexColorValueInput} fullWidth />
      {error && (
        <Text>
          <Muted style={{ color: "red" }}>{error}</Muted>
        </Text>
      )}
      <VerticalSpace space="medium" />
    </>
  );
}
