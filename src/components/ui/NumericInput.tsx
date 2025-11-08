import { h, Fragment } from "preact";
import { Muted, Text, TextboxNumeric, VerticalSpace } from "@create-figma-plugin/ui";

interface NumericInputProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
}

export function NumericInput({ label, value, onChange, placeholder }: NumericInputProps) {
  return (
    <Fragment>
      <Text>
        <Muted>{label}</Muted>
      </Text>
      <VerticalSpace space="small" />
      <TextboxNumeric value={value !== null ? String(value) : ""} onNumericValueInput={onChange} placeholder={placeholder} />
      <VerticalSpace space="medium" />
    </Fragment>
  );
}
