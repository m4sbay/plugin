import { Button, Dropdown, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useState, useCallback, useEffect } from "preact/hooks";
import { InputField } from "./ui/InputField";
import { ColorPicker } from "./ui/ColorPicker";
import { FlexibleSizeInput } from "./ui/FlexibleSizeInput";
import { SMALL_FONT_SIZE_PRESETS, SMALL_BORDER_RADIUS_PRESETS } from "../config/presets";

export function TooltipCreator({ onBack }: { onBack: () => void }) {
  // State untuk Tooltip
  const [tooltipText, setTooltipText] = useState("Material Tailwind");
  const [buttonText, setButtonText] = useState("Show Tooltip");

  // Button styling
  const [buttonBgColor, setButtonBgColor] = useState("#111827");
  const [buttonTextColor, setButtonTextColor] = useState("#FFFFFF");
  const [buttonHoverBgColor, setButtonHoverBgColor] = useState("#1E40AF");
  const [buttonFocusRingColor, setButtonFocusRingColor] = useState("#60A5FA");

  const [position, setPosition] = useState("top");
  const [fontSize, setFontSize] = useState("14");
  const [bgColor, setBgColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [borderRadius, setBorderRadius] = useState("8");
  const [padding, setPadding] = useState("6px,12px");

  const positionOptions = [
    { value: "top", text: "Atas" },
    { value: "bottom", text: "Bawah" },
    { value: "left", text: "Kiri" },
    { value: "right", text: "Kanan" },
  ];

  const [htmltailwind, setHtmltailwind] = useState("");

  // Generate Tailwind code dengan format Material Tailwind
  const generateCode = useCallback(() => {
    // Generate unique ID untuk tooltip
    const tooltipId = `tooltip-${buttonText.toLowerCase().replace(/\s+/g, "-")}`;

    // Parse values
    const fontSizeValue = fontSize.replace(/px/gi, "").trim() || "14";
    const borderRadiusValue = borderRadius.replace(/px/gi, "").trim() || "8";

    // Parse padding untuk tooltip
    let paddingX = "12";
    let paddingY = "6";
    if (padding) {
      const paddingValues = padding.split(",").map((val: string) => val.trim().replace(/px/gi, ""));
      if (paddingValues.length === 2) {
        paddingY = paddingValues[0] || "6";
        paddingX = paddingValues[1] || "12";
      }
    }

    // Parse padding untuk button (default py-3 px-6)
    const buttonPaddingX = "24"; // px-6 = 24px
    const buttonPaddingY = "12"; // py-3 = 12px

    // Convert hex to RGB untuk shadow (gunakan warna buttonBgColor)
    const shadowColor = buttonBgColor.replace("#", "");

    // Button classes sesuai format Material Tailwind
    const buttonClasses = [
      "select-none",
      `rounded-lg`,
      `bg-[${buttonBgColor}]`,
      `py-[${buttonPaddingY}px]`,
      `px-[${buttonPaddingX}px]`,
      "text-center",
      "align-middle",
      "font-sans",
      "text-xs",
      "font-bold",
      "uppercase",
      `text-[${buttonTextColor}]`,
      "shadow-md",
      `shadow-[${shadowColor}]/10`,
      "transition-all",
      "hover:shadow-lg",
      `hover:shadow-[${shadowColor}]/20`,
      "focus:opacity-[0.85]",
      "focus:shadow-none",
      "active:opacity-[0.85]",
      "active:shadow-none",
      "disabled:pointer-events-none",
      "disabled:opacity-50",
      "disabled:shadow-none",
    ].join(" ");

    // Tooltip classes sesuai format Material Tailwind
    const tooltipClasses = [
      "absolute",
      "z-50",
      "whitespace-normal",
      "break-words",
      `rounded-lg`,
      `bg-[${bgColor}]`,
      `py-[${paddingY}px]`,
      `px-[${paddingX}px]`,
      "font-sans",
      `text-[${fontSizeValue}px]`,
      "font-normal",
      `text-[${textColor}]`,
      "focus:outline-none",
    ].join(" ");

    const html = `<button data-ripple-light="true" data-tooltip-target="${tooltipId}"
    class="${buttonClasses}">
    ${buttonText}
  </button>

  <div data-tooltip="${tooltipId}"
    class="${tooltipClasses}">
    ${tooltipText}
  </div>`;

    setHtmltailwind(html);
    return html;
  }, [tooltipText, buttonText, position, fontSize, bgColor, textColor, borderRadius, padding, buttonBgColor, buttonTextColor, buttonHoverBgColor, buttonFocusRingColor]);

  useEffect(() => {
    generateCode();
  }, [generateCode]);

  // Emit ke Figma
  const handleCreateTooltip = () => {
    emit("CREATE_TOOLTIP", {
      tooltipText,
      buttonText,
      position,
      fontSize,
      bgColor,
      textColor,
      borderRadius,
      padding,
      buttonBgColor,
      buttonTextColor,
      buttonHoverBgColor,
      buttonFocusRingColor,
      htmltailwind,
    });
  };

  return (
    <div style={{ padding: "32px 24px 24px 24px", fontFamily: "Inter, system-ui, sans-serif", background: "#fff", minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", marginRight: 8, padding: 0, display: "flex", alignItems: "center" }}>
          <svg width="15" height="20" viewBox="0 0 20 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.57426 13.7604C1.58095 13.5264 1.62774 13.3125 1.71464 13.1187C1.80155 12.9248 1.93524 12.7376 2.11573 12.5571L12.1629 2.8308C12.4504 2.54335 12.8047 2.39963 13.2258 2.39963C13.5066 2.39963 13.7606 2.46648 13.9879 2.60017C14.2218 2.73387 14.4057 2.91436 14.5394 3.14164C14.6798 3.36892 14.7499 3.62294 14.7499 3.9037C14.7499 4.31816 14.5929 4.68248 14.2787 4.99666L5.19407 13.7504L14.2787 22.5141C14.5929 22.835 14.7499 23.1993 14.7499 23.6071C14.7499 23.8945 14.6798 24.1519 14.5394 24.3792C14.4057 24.6064 14.2218 24.7869 13.9879 24.9206C13.7606 25.061 13.5066 25.1312 13.2258 25.1312C12.8047 25.1312 12.4504 24.9841 12.1629 24.69L2.11573 14.9637C1.92856 14.7832 1.79152 14.596 1.70462 14.4021C1.61771 14.2016 1.57426 13.9877 1.57426 13.7604Z"
              fill="#007AFF"
            />
          </svg>
        </button>
        <Text style={{ fontSize: 28, fontWeight: 600, color: "#222" }}>Tooltip</Text>
      </div>
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Kolom 1: Style */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Pengaturan :</Text>
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, marginTop: 12 }}>Konten :</Text>
          <InputField label="Teks Tooltip :" value={tooltipText} onChange={setTooltipText} placeholder="Contoh: Tooltip content" />
          <InputField label="Teks Button :" value={buttonText} onChange={setButtonText} placeholder="Contoh: Default tooltip" />
          <Dropdown options={positionOptions} value={position} onValueChange={setPosition} />

          <Text style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, marginTop: 12 }}>Button Styling :</Text>
          <ColorPicker label="Warna latar button :" value={buttonBgColor} onChange={setButtonBgColor} />
          <ColorPicker label="Warna teks button :" value={buttonTextColor} onChange={setButtonTextColor} />
          <ColorPicker label="Warna hover button :" value={buttonHoverBgColor} onChange={setButtonHoverBgColor} />
          <ColorPicker label="Warna focus ring button :" value={buttonFocusRingColor} onChange={setButtonFocusRingColor} />

          <Text style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, marginTop: 12 }}>Tooltip Styling :</Text>
          <FlexibleSizeInput label="Ukuran teks tooltip:" value={fontSize} onChange={setFontSize} presets={SMALL_FONT_SIZE_PRESETS} unit="px" placeholder="Contoh: 14" />
          <ColorPicker label="Warna latar tooltip :" value={bgColor} onChange={setBgColor} />
          <ColorPicker label="Warna teks tooltip :" value={textColor} onChange={setTextColor} />
          <FlexibleSizeInput label="Border radius tooltip:" value={borderRadius} onChange={setBorderRadius} presets={SMALL_BORDER_RADIUS_PRESETS} unit="px" placeholder="Contoh: 8" />
          <InputField label="Padding tooltip (py,px) :" value={padding} onChange={setPadding} placeholder="Contoh: 8px,12px" />
        </div>

        {/* Kolom 2: Live Preview & Kode */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 500, position: "sticky", top: 24, alignSelf: "flex-start", zIndex: 2 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Live Preview :</Text>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, background: "#f8f9fa", minHeight: 120, marginBottom: 24, padding: 24, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <button
                style={{
                  padding: "10px 20px",
                  background: buttonBgColor,
                  color: buttonTextColor,
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {buttonText}
              </button>
              <div
                style={{
                  position: "absolute",
                  [position]: position === "top" || position === "bottom" ? "100%" : "50%",
                  [position === "left" ? "right" : position === "right" ? "left" : "left"]: position === "left" || position === "right" ? "100%" : "50%",
                  transform: position === "top" || position === "bottom" ? "translateX(-50%)" : "translateY(-50%)",
                  background: bgColor,
                  color: textColor,
                  fontSize: fontSize ? `${fontSize.replace(/px/gi, "").trim()}px` : "14px",
                  padding: padding ? `${padding.split(",")[0]?.trim() || "8px"} ${padding.split(",")[1]?.trim() || "12px"}` : "8px 12px",
                  borderRadius: `${borderRadius.replace(/px/gi, "").trim() || "8"}px`,
                  whiteSpace: "nowrap",
                  marginTop: position === "top" ? "-8px" : position === "bottom" ? "8px" : "0",
                  marginLeft: position === "left" ? "-8px" : position === "right" ? "8px" : "0",
                  fontWeight: 500,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                {tooltipText}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Button fullWidth secondary onClick={onBack}>
              Tutup
            </Button>
            <Button fullWidth onClick={handleCreateTooltip}>
              Buat
            </Button>
          </div>
          <Text style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Kode :</Text>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, background: "#f8f9fa", minHeight: 80, padding: 16, fontFamily: "monospace", fontSize: 13, color: "#222", wordBreak: "break-all", position: "relative" }}>
            <Textbox value={htmltailwind} onValueInput={() => {}} style={{ background: "transparent", border: "none", width: "100%", minHeight: 60 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
