import { Muted, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
import { h, Fragment } from "preact";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function InputField({ label, value, onChange, placeholder }: InputFieldProps) {
  return (
    <>
      <Text>
        <Muted>{label}</Muted>
      </Text>
      <VerticalSpace space="small" />
      <Textbox value={value} onValueInput={onChange} placeholder={placeholder} />
      <VerticalSpace space="medium" />
    </>
  );
}

