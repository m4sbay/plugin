import { Button, Dropdown, Muted, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useState, useCallback, useEffect } from "preact/hooks";
import { InputField } from "./ui/InputField";
import { ColorPicker } from "./ui/ColorPicker";

export function RadioButton({ onBack }: { onBack: () => void }) {
  return (
    <div>
      <Text>Radio Button</Text>
    </div>
  );
}