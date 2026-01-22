import { Button, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useState, useCallback, useEffect, useMemo } from "preact/hooks";
import { SelectionChangeHandler } from "../types/types";
import { InputField } from "./ui/InputField";
import { ColorPicker } from "./ui/ColorPicker";
import { Prism as SyntaxHighlighterComponent } from "react-syntax-highlighter";
import { duotoneDark, prism, shadesOfPurple, vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
// Gunakan casting 'as any' untuk menghindari error JSX
const SyntaxHighlighter = SyntaxHighlighterComponent as any;
import { formatHTML } from "../utils/htmlFormatter";

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
  const [label, setLabel] = useState("Nama Lengkap");
  const [labelColor, setLabelColor] = useState("#64748B");
  const [labelFontSize, setLabelFontSize] = useState("14");
  const [placeholder, setPlaceholder] = useState("Masukkan nama lengkap kamu");
  const [width, setWidth] = useState("");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [borderRadius, setBorderRadius] = useState("8");
  const [borderColor, setBorderColor] = useState("#CBD5E1");
  const [paddingX, setPaddingX] = useState("12");
  const [paddingY, setPaddingY] = useState("8");
  const [padding, setPadding] = useState("12, 8");
  const [gap, setGap] = useState("10");
  const [inputTextColor, setInputTextColor] = useState("#111827");

  // State Style Dinamis
  const [focusRingColor, setFocusRingColor] = useState("#6366F1");

  const [htmltailwind, setHtmltailwind] = useState("");
  const [copied, setCopied] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Helper function untuk normalize hex color (pastikan ada # di depan)
  const normalizeHex = useCallback((color: string): string => {
    if (!color) return "#000000";
    const cleanColor = color.replace("#", "").toUpperCase();
    return `#${cleanColor}`;
  }, []);

  // Helper function untuk parse padding string "x, y" menjadi [x, y]
  const parsePadding = useCallback((paddingStr: string): [string, string] => {
    const parts = paddingStr.split(",").map(p => p.trim());
    const x = parts[0] || "12";
    const y = parts[1] || parts[0] || "8";
    return [x, y];
  }, []);

  // Helper function untuk format paddingX dan paddingY menjadi string "x, y"
  const formatPadding = useCallback((x: string, y: string): string => {
    return `${x}, ${y}`;
  }, []);

  // Generate HTML string menggunakan useMemo
  const htmlCode = useMemo(() => {
    // Parse values
    const labelSize = labelFontSize.replace(/px/gi, "").trim() || "14";
    const gapValue = gap.replace(/px/gi, "").trim() || "12";
    const borderRadiusValue = borderRadius.replace(/px/gi, "").trim() || "8";
    const paddingXValue = paddingX.replace(/px/gi, "").trim() || "12";
    const paddingYValue = paddingY.replace(/px/gi, "").trim() || "8";

    // Normalize hex colors
    const labelColorHex = normalizeHex(labelColor);
    const borderColorHex = normalizeHex(borderColor);
    const inputTextColorHex = normalizeHex(inputTextColor);
    const focusRingColorHex = normalizeHex(focusRingColor);

    // Label classes
    const labelClasses = `text-[${labelSize}px] font-medium text-[${labelColorHex}] flex items-center gap-1`;

    // Input classes
    let inputClasses = `rounded-[${borderRadiusValue}px] border border-[${borderColorHex}] px-[${paddingXValue}px] py-[${paddingYValue}px] text-[${labelSize}px] text-[${inputTextColorHex}] outline-none placeholder:text-[${inputTextColorHex}] placeholder:opacity-50 focus:ring-1 focus:ring-[${focusRingColorHex}]`;

    // Tambahkan width ke input jika ada
    if (width) {
      const widthValue = width.replace(/px/gi, "").trim();
      if (widthValue) {
        inputClasses += ` w-[${widthValue}px]`;
      }
    }

    // Generate HTML sesuai struktur baru
    return `<div class="flex flex-col gap-[${gapValue}px]"><label class="${labelClasses}">${label}</label><input type="text" placeholder="${placeholder}" class="${inputClasses}" /></div>`;
  }, [label, labelColor, labelFontSize, placeholder, width, borderRadius, borderColor, paddingX, paddingY, gap, inputTextColor, focusRingColor, normalizeHex]);

  // Format HTML secara async
  useEffect(() => {
    (async () => {
      const formattedHtml = await formatHTML(htmlCode);
      setHtmltailwind(formattedHtml);
    })();
  }, [htmlCode]);

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
            if (textFieldData.borderColor) setBorderColor(textFieldData.borderColor);
            if (textFieldData.paddingX) setPaddingX(textFieldData.paddingX);
            if (textFieldData.paddingY) setPaddingY(textFieldData.paddingY);
            // Update padding state dari paddingX dan paddingY
            if (textFieldData.paddingX || textFieldData.paddingY) {
              const x = textFieldData.paddingX || "12";
              const y = textFieldData.paddingY || "8";
              setPadding(formatPadding(x, y));
            }
            if (textFieldData.gap) setGap(textFieldData.gap);
            if (textFieldData.inputTextColor) setInputTextColor(textFieldData.inputTextColor);
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
    emit("CREATE_TEXT_FIELD", {
      label,
      labelColor,
      fontSize: labelFontSize,
      placeholder,
      width: width || "",
      height: "",
      bgColor,
      borderRadius,
      borderColor,
      paddingX,
      paddingY,
      gap,
      inputTextColor,
      focusRingColor,
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
        <div style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto", flex: 1, minWidth: 260, paddingTop: 4, paddingRight: 16 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Style Statis :</Text>
          <VerticalSpace space="small" />
          <InputField label="Label Input :" value={label} onChange={setLabel} placeholder="Contoh: Nama Lengkap" />
          <ColorPicker label="Warna label :" value={labelColor} onChange={setLabelColor} />
          <InputField label="Ukuran teks label (px) :" value={labelFontSize} onChange={setLabelFontSize} placeholder="Contoh: 14 (akan menjadi text-[14px])" />
          <InputField label="Placeholder :" value={placeholder} onChange={setPlaceholder} placeholder="Contoh: Masukkan nama tampilan" />
          <InputField label="Lebar input (px) :" value={width} onChange={setWidth} placeholder="Contoh: 300 (kosongkan untuk auto)" />
          <InputField label="Gap label dan input (px) :" value={gap} onChange={setGap} placeholder="Contoh: 12 (akan menjadi gap-[12px])" />
          <InputField label="Border radius (px) :" value={borderRadius} onChange={setBorderRadius} placeholder="Contoh: 8 (akan menjadi rounded-[8px])" />
          <ColorPicker label="Warna border input :" value={borderColor} onChange={setBorderColor} />
          <InputField
            label="Padding sumbu x dan y :"
            value={padding}
            onChange={value => {
              setPadding(value);
              const [x, y] = parsePadding(value);
              setPaddingX(x);
              setPaddingY(y);
            }}
            placeholder="Contoh: 12, 8"
          />
          <ColorPicker label="Warna teks input :" value={inputTextColor} onChange={setInputTextColor} />
        </div>
        {/* Kolom 2: Style Dinamis */}
        <div style={{ flex: 0.3, minWidth: 160}}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Style Dinamis :</Text>
          <VerticalSpace space="small" />
          <ColorPicker label="Warna ring saat focus :" value={focusRingColor} onChange={setFocusRingColor} />
        </div>
        {/* Kolom 3: Live Preview & Kode */}
        <div style={{ flex: 1.9, minWidth: 320, maxWidth: 500, position: "sticky", top: 24, alignSelf: "flex-start", zIndex: 2, display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, color: theme.primaryText }}>Live Preview :</Text>
          <div
            style={{
              border: ` 1px solid ${theme.panelBorder}`,
              borderRadius: 8,
              background: theme.panelBackground,
              flex: 1,
              minHeight: 0,
              marginBottom: 24,
              padding: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: `${gap.replace(/px/gi, "") || 12}px`, width: "100%", maxWidth: "100%", overflow: "visible" }}>
              <label style={{ fontSize: `${labelFontSize.replace(/px/gi, "") || 14}px`, fontWeight: 500, color: labelColor, display: "flex", alignItems: "center", gap: "4px" }}>{label}</label>
              <input
                type="text"
                placeholder={placeholder}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={{
                  borderRadius: `${borderRadius.replace(/px/gi, "") || 8}px`,
                  border: `1px solid ${borderColor}`,
                  padding: `${paddingY.replace(/px/gi, "") || 8}px ${paddingX.replace(/px/gi, "") || 12}px`,
                  fontSize: `${labelFontSize.replace(/px/gi, "") || 14}px`,
                  color: inputTextColor,
                  width: width ? `${width.replace(/px/gi, "")}px` : "100%",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                  outline: "none",
                  background: bgColor,
                  boxShadow: isFocused ? `0 0 0 1px ${focusRingColor}` : "none",
                  transition: "box-shadow 0.15s ease-in-out",
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Button fullWidth danger onClick={onBack}>
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
              flex: 1,
              minHeight: 0,
              padding: 0, // Set ke 0 agar highlighter mengisi penuh kontainer
              fontFamily: "monospace",
              fontSize: 13,
              color: theme.codeText,
              position: "relative",
              overflow: "auto", // Ubah dari "hidden" ke "auto" untuk scroll
            }}
          >
            <SyntaxHighlighter
              language="html"
              style={isDark ? shadesOfPurple : prism}
              wrapLines={true} // Mengaktifkan fitur wrap per baris
              lineProps={{
                style: {
                  whiteSpace: "pre", // Ubah dari "pre-wrap" ke "pre" untuk mempertahankan indentasi
                  wordBreak: "normal", // Ubah dari "break-all" ke "normal"
                  overflowWrap: "break-word", // Tambahkan untuk wrap yang lebih baik
                },
              }}
              customStyle={{
                margin: 0,
                padding: "16px",
                fontSize: "13px",
                background: "transparent",
                height: "100%",
                width: "100%",
                overflowX: "auto", // Tambahkan scroll horizontal jika perlu
                overflowY: "auto", // Tambahkan scroll vertical
                fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace", // Pastikan font monospace konsisten
                lineHeight: "1.5", // Tambahkan line height untuk readability
              }}
            >
              {htmltailwind}
            </SyntaxHighlighter>
          </div>
          <VerticalSpace space="small" />
          <Button onClick={handleCopyCode}  style={{ padding: "4px 12px", fontSize: 12, height: "auto" }}>
            {copied ? "Tersalin!" : "Copy"}
          </Button>
        </div>
      </div>
    </div>
  );
}
