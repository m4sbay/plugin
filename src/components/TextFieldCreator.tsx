import { Button, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useState, useCallback, useEffect } from "preact/hooks";
import { SelectionChangeHandler } from "../types/types";
import { InputField } from "./ui/InputField";
import { ColorPicker } from "./ui/ColorPicker";

type TextFieldCreatorProps = {
  onBack: () => void;
  isDark?: boolean;
};

export function TextFieldCreator({ onBack, isDark = false }: TextFieldCreatorProps) {
  const theme = {
    background: isDark ? "#0A0F1C" : "#FFFFFF",
    primaryText: isDark ? "#F1F5F9" : "#222222",
    accent: isDark ? "#60A5FA" : "#007AFF",
    panelBorder: isDark ? "rgba(148, 163, 184, 0.35)" : "#e5e7eb",
    panelBackground: isDark ? "#111827" : "#f8f9fa",
    codeBackground: isDark ? "#0F172A" : "#f8f9fa",
    codeText: isDark ? "#E2E8F0" : "#222222",
  };
  // State Style Statis
  const [label, setLabel] = useState("Label");
  const [labelColor, setLabelColor] = useState("#00BCFF");
  const [labelFontSize, setLabelFontSize] = useState("14");
  const [placeholder, setPlaceholder] = useState("Contoh : nama lengkap");
  const [width, setWidth] = useState("");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [borderRadius, setBorderRadius] = useState("6");
  const [outlineColor, setOutlineColor] = useState("#D1D5DB");
  const [inputPadding, setInputPadding] = useState("6"); // py-1.5 = 6px
  const [wrapperPadding, setWrapperPadding] = useState("12"); // pl-3 = 12px

  // State Style Dinamis
  const [focusRingColor, setFocusRingColor] = useState("#4F46E5"); // indigo-600

  const [htmltailwind, setHtmltailwind] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate Tailwind class berdasarkan struktur baru
  const generateCode = useCallback(() => {
    // Label classes
    const labelSize = labelFontSize.replace(/px/gi, "").trim() || "14";
    const labelClasses = `block text-[${labelSize}px] font-medium`;
    const labelStyle = labelColor ? ` style="color: ${labelColor}"` : "";

    // Wrapper classes (container untuk input)
    const borderRadiusValue = borderRadius.replace(/px/gi, "").trim() || "6";
    const wrapperPaddingValue = wrapperPadding.replace(/px/gi, "").trim() || "12";
    const outlineColorValue = outlineColor || "#D1D5DB";
    const focusRingColorValue = focusRingColor || "#4F46E5";

    let wrapperClasses = `flex items-center rounded-[${borderRadiusValue}px] bg-[${bgColor}] pl-[${wrapperPaddingValue}px] outline-1 -outline-offset-1 outline-[${outlineColorValue}] has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-[${focusRingColorValue}]`;

    // Input classes - menggunakan labelFontSize untuk text dan placeholder
    const inputPaddingValue = inputPadding.replace(/px/gi, "").trim() || "6";
    let inputClasses = `block min-w-0 grow py-[${inputPaddingValue}px] pr-[${parseInt(inputPaddingValue) * 2}px] pl-[${parseInt(inputPaddingValue)}px] text-[${labelSize}px] text-gray-900 placeholder:text-gray-400 focus:outline-none`;

    // Tambahkan width ke wrapper jika ada
    if (width) {
      const widthValue = width.replace(/px/gi, "").trim();
      if (widthValue) {
        wrapperClasses += ` w-[${widthValue}px]`;
      }
    }

    // Generate HTML sesuai struktur baru
    const html = `<div>
  <label for="textfield" class="${labelClasses}"${labelStyle}>${label}</label>
  <div class="mt-2">
    <div class="${wrapperClasses}">
      <input id="textfield" type="text" name="textfield" placeholder="${placeholder}" class="${inputClasses}" />
    </div>
  </div>
</div>`;

    setHtmltailwind(html);
    return html;
  }, [label, labelColor, labelFontSize, placeholder, width, bgColor, borderRadius, outlineColor, inputPadding, wrapperPadding, focusRingColor]);

  useEffect(() => {
    generateCode();
  }, [generateCode]);

  // Load data when text field component is selected
  useEffect(() => {
    on<SelectionChangeHandler>("SELECTION_CHANGE", data => {
      if (data) {
        try {
          // Try to parse as JSON (text field data)
          const textFieldData = JSON.parse(data);
          if (textFieldData.htmltailwind) {
            // Load all text field data
            setHtmltailwind(textFieldData.htmltailwind);
            if (textFieldData.label) setLabel(textFieldData.label);
            if (textFieldData.labelColor) setLabelColor(textFieldData.labelColor);
            if (textFieldData.labelFontSize) setLabelFontSize(textFieldData.labelFontSize);
            if (textFieldData.placeholder) setPlaceholder(textFieldData.placeholder);
            if (textFieldData.width) setWidth(textFieldData.width);
            if (textFieldData.bgColor) setBgColor(textFieldData.bgColor);
            if (textFieldData.borderRadius) setBorderRadius(textFieldData.borderRadius);
            if (textFieldData.outlineColor) setOutlineColor(textFieldData.outlineColor);
            if (textFieldData.inputPadding) setInputPadding(textFieldData.inputPadding);
            if (textFieldData.wrapperPadding) setWrapperPadding(textFieldData.wrapperPadding);
            if (textFieldData.focusRingColor) setFocusRingColor(textFieldData.focusRingColor);
          }
        } catch (e) {
          // If not JSON, treat as plain htmltailwind string (for other components)
          setHtmltailwind(data);
        }
      } else {
        setHtmltailwind("");
      }
    });
  }, []);

  // Fungsi untuk copy kode ke clipboard
  const handleCopyCode = useCallback(async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(htmltailwind);
      } else {
        // Fallback untuk browser yang tidak support Clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = htmltailwind;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [htmltailwind]);

  // Emit ke Figma saat klik Buat
  const handleCreateTextField = () => {
    // Format padding: "wrapperPadding,inputPadding" untuk memisahkan wrapper padding dan input padding
    emit("CREATE_TEXT_FIELD", {
      label,
      labelColor,
      fontSize: labelFontSize,
      placeholder,
      width: width || "",
      height: "",
      bgColor,
      borderRadius,
      outlineWidth: "1",
      outlineColor,
      padding: `${wrapperPadding},${inputPadding}`,
      shadow: "",
      hoverBgColor: "",
      activeRingWidth: "2",
      ringColor: focusRingColor,
      transitionType: "normal",
      labelGap: "8",
      htmltailwind,
    });
  };

  return (
    <div
      style={{
        padding: "32px 24px 24px 24px",
        fontFamily: "Inter, system-ui, sans-serif",
        background: theme.background,
        minHeight: "100vh",
        color: theme.primaryText,
        transition: "background 0.25s ease, color 0.25s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", marginRight: 8, padding: 0, display: "flex", alignItems: "center" }}>
          <svg width="15" height="20" viewBox="0 0 20 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.57426 13.7604C1.58095 13.5264 1.62774 13.3125 1.71464 13.1187C1.80155 12.9248 1.93524 12.7376 2.11573 12.5571L12.1629 2.8308C12.4504 2.54335 12.8047 2.39963 13.2258 2.39963C13.5066 2.39963 13.7606 2.46648 13.9879 2.60017C14.2218 2.73387 14.4057 2.91436 14.5394 3.14164C14.6798 3.36892 14.7499 3.62294 14.7499 3.9037C14.7499 4.31816 14.5929 4.68248 14.2787 4.99666L5.19407 13.7504L14.2787 22.5141C14.5929 22.835 14.7499 23.1993 14.7499 23.6071C14.7499 23.8945 14.6798 24.1519 14.5394 24.3792C14.4057 24.6064 14.2218 24.7869 13.9879 24.9206C13.7606 25.061 13.5066 25.1312 13.2258 25.1312C12.8047 25.1312 12.4504 24.9841 12.1629 24.69L2.11573 14.9637C1.92856 14.7832 1.79152 14.596 1.70462 14.4021C1.61771 14.2016 1.57426 13.9877 1.57426 13.7604Z"
              fill={theme.accent}
            />
          </svg>
        </button>
        <Text style={{ fontSize: 28, fontWeight: 600, color: theme.primaryText }}>Text Field</Text>
      </div>
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Kolom 1: Style Statis */}
        <div style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto", flex: 1, minWidth: 260, paddingTop: 4 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Style Statis :</Text>
          <VerticalSpace space="small" />
          <InputField label="Label Input :" value={label} onChange={setLabel} placeholder="Contoh: Label" />
          <ColorPicker label="Warna label :" value={labelColor} onChange={setLabelColor} />
          <InputField label="Ukuran teks label (px) :" value={labelFontSize} onChange={setLabelFontSize} placeholder="Contoh: 14" />
          <InputField label="Placeholder :" value={placeholder} onChange={setPlaceholder} placeholder="Contoh: nama lengkap" />
          <InputField label="Lebar input (px) :" value={width} onChange={setWidth} placeholder="Contoh: 300" />
          <ColorPicker label="Warna Latar :" value={bgColor} onChange={setBgColor} />
          <InputField label="Border radius (px) :" value={borderRadius} onChange={setBorderRadius} placeholder="Contoh: 6" />
          <ColorPicker label="Warna outline :" value={outlineColor} onChange={setOutlineColor} />
          <InputField label="Padding wrapper (px) :" value={wrapperPadding} onChange={setWrapperPadding} placeholder="Contoh: 12" />
          <InputField label="Padding input (px) :" value={inputPadding} onChange={setInputPadding} placeholder="Contoh: 6" />
        </div>
        {/* Kolom 2: Style Dinamis */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Style Dinamis :</Text>
          <VerticalSpace space="small" />
          <ColorPicker label="Warna ring saat focus :" value={focusRingColor} onChange={setFocusRingColor} />
        </div>
        {/* Kolom 3: Live Preview & Kode */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 400, position: "sticky", top: 24, alignSelf: "flex-start", zIndex: 2 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, color: theme.primaryText }}>Live Preview :</Text>
          <div
            style={{
              border: `1px solid ${theme.panelBorder}`,
              borderRadius: 8,
              background: theme.panelBackground,
              minHeight: 120,
              marginBottom: 24,
              padding: 24,
            }}
          >
            <div>
              <label style={{ display: "block", fontSize: `${labelFontSize}px`, fontWeight: 500, color: labelColor, marginBottom: 8 }}>{label}</label>
              <div style={{ marginTop: 8 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: `${borderRadius}px`,
                    background: bgColor,
                    paddingLeft: `${wrapperPadding}px`,
                    outline: `1px solid ${outlineColor}`,
                    outlineOffset: "-1px",
                    width: width ? `${width.replace(/px/gi, "")}px` : "auto",
                  }}
                >
                  <input
                    type="text"
                    placeholder={placeholder}
                    style={{
                      display: "block",
                      minWidth: 0,
                      flexGrow: 1,
                      width: "100%",
                      padding: `${inputPadding}px ${parseInt(inputPadding) * 2}px ${inputPadding}px ${inputPadding}px`,
                      fontSize: `${labelFontSize}px`,
                      color: "#111827",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Button fullWidth secondary onClick={onBack}>
              Tutup
            </Button>
            <Button fullWidth onClick={handleCreateTextField}>
              Buat
            </Button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <Text style={{ fontWeight: 600, fontSize: 16, color: theme.primaryText }}>Kode :</Text>
          </div>
          <div
            style={{
              border: `1px solid ${theme.panelBorder}`,
              borderRadius: 8,
              background: theme.codeBackground,
              minHeight: 80,
              padding: 16,
              fontFamily: "monospace",
              fontSize: 13,
              color: theme.codeText,
              wordBreak: "break-all",
              position: "relative",
            }}
          >
            <Textbox value={htmltailwind} onValueInput={() => {}} style={{ background: "transparent", border: "none", width: "100%", minHeight: 60, color: theme.codeText }} />
          </div>
          <VerticalSpace space="small" />
          <Button onClick={handleCopyCode} secondary style={{ padding: "4px 12px", fontSize: 12, height: "auto" }}>
            {copied ? "Tersalin!" : "Copy"}
          </Button>
        </div>
      </div>
    </div>
  );
}
