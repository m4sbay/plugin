import { Muted, Text, VerticalSpace } from "@create-figma-plugin/ui";
import { h, Fragment } from "preact";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  error?: string;
}

export function ColorPicker({ label, value, onChange, error }: ColorPickerProps) {
  const handleChange = (e: any) => {
    const newColor = e.target.value;
    onChange(newColor);
  };

  return (
    <>
      <Text>
        <Muted>{label}</Muted>
      </Text>
      <VerticalSpace space="small" />
      <input type="color" value={value} onChange={handleChange} className="color-picker" />
      {error && (
        <Text>
          <Muted style={{ color: "red" }}>{error}</Muted>
        </Text>
      )}
      <VerticalSpace space="medium" />
    </>
  );
}
