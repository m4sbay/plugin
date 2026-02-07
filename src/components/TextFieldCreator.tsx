import { Button, IconClose16, IconDev16, IconWand16, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
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
import { copyToClipboard } from "../utils/clipboardUtils";

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
  // --- Style Statis (urutan sesuai input di UI Kolom 1) ---
  const [label, setLabel] = useState("Username");
  const [labelColor, setLabelColor] = useState("#64748B");
  const [labelFontSize, setLabelFontSize] = useState("12");
  const [placeholder, setPlaceholder] = useState("");
  const [width, setWidth] = useState("");
  const [gap, setGap] = useState("10");
  const [borderRadius, setBorderRadius] = useState("16");
  const [borderColor, setBorderColor] = useState("#CBD5E1");
  const [paddingX, setPaddingX] = useState("12");
  const [paddingY, setPaddingY] = useState("8");
  const [padding, setPadding] = useState("12, 8");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [inputTextColor, setInputTextColor] = useState("#111827");

  // --- Style Dinamis (urutan sesuai input di UI Kolom 2) ---
  const [focusRingColor, setFocusRingColor] = useState("#0B99FF");

  // --- UI state ---
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
      if (!data) {
        setHtmltailwind("");
        return;
      }
      try {
        const parsed = JSON.parse(data);
        if (parsed?.componentType === "text-field") {
          setHtmltailwind(parsed.htmltailwind || "");
          if (parsed.label !== undefined) setLabel(parsed.label);
          if (parsed.labelColor !== undefined) setLabelColor(parsed.labelColor);
          if (parsed.labelFontSize !== undefined) setLabelFontSize(parsed.labelFontSize);
          if (parsed.placeholder !== undefined) setPlaceholder(parsed.placeholder);
          if (parsed.width !== undefined) setWidth(parsed.width);
          if (parsed.bgColor !== undefined) setBgColor(parsed.bgColor);
          if (parsed.borderRadius !== undefined) setBorderRadius(parsed.borderRadius);
          if (parsed.borderColor !== undefined) setBorderColor(parsed.borderColor);
          if (parsed.paddingX !== undefined) setPaddingX(parsed.paddingX);
          if (parsed.paddingY !== undefined) setPaddingY(parsed.paddingY);
          if (parsed.paddingX !== undefined || parsed.paddingY !== undefined) {
            const x = parsed.paddingX || "12";
            const y = parsed.paddingY || "8";
            setPadding(formatPadding(x, y));
          }
          if (parsed.gap !== undefined) setGap(parsed.gap);
          if (parsed.inputTextColor !== undefined) setInputTextColor(parsed.inputTextColor);
          if (parsed.focusRingColor !== undefined) setFocusRingColor(parsed.focusRingColor);
        }
      } catch (e) {
        setHtmltailwind(data);
      }
    });
  }, []);

  const handleCopyCode = useCallback(async () => {
    const success = await copyToClipboard(htmltailwind);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
      <div style={{ display: "flex", alignItems: "center" }}>
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
      <VerticalSpace space="large" />
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Kolom 1: Style Statis */}
        <div style={{ flex: 1, minWidth: 260, paddingRight: 16 }}>
          <Text style={{ fontWeight: 600, fontSize: 18 }}>Style Statis :</Text>
          <VerticalSpace space="large" />
          <InputField label="Label Input :" value={label} onChange={setLabel} placeholder="Contoh: Nama Lengkap" />
          <ColorPicker label="Warna label :" value={labelColor} onChange={setLabelColor} />
          <InputField label="Ukuran teks label (px) :" value={labelFontSize} onChange={setLabelFontSize} placeholder="Contoh: 14 (akan menjadi text-[14px])" />
          <InputField label="Placeholder :" value={placeholder} onChange={setPlaceholder} placeholder="Contoh: Masukkan username kamu" />
          <InputField label="Lebar input (px) :" value={width} onChange={setWidth} placeholder="Contoh: 300 atau kosongkan untuk auto" />
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
        <div style={{ flex: 0.3, minWidth: 160 }}>
          <Text style={{ fontWeight: 600, fontSize: 18 }}>Style Dinamis :</Text>
          <VerticalSpace space="large" />
          <ColorPicker label="Warna ring saat focus :" value={focusRingColor} onChange={setFocusRingColor} />
        </div>
        {/* Kolom 3: Live Preview & Kode */}
        <div style={{ flex: 1.9, minWidth: 320, maxWidth: 500, display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
          <Text style={{ fontWeight: 600, fontSize: 18, color: theme.primaryText }}>Live Preview :</Text>
          <VerticalSpace space="large" />
          <div
            style={{
              border: ` 1px solid ${theme.panelBorder}`,
              borderRadius: 8,
              background: theme.panelBackground,
              flex: 1,
              minHeight: 0,
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
          <VerticalSpace space="large" />
          <div style={{ display: "flex", gap: 12 }}>
            <Button fullWidth danger onClick={onBack}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <IconClose16 />
                Tutup
              </span>
            </Button>
            <Button fullWidth onClick={handleCreateTextField}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <IconWand16 />
                Buat
              </span>
            </Button>
          </div>
          <VerticalSpace space="large" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontWeight: 600, fontSize: 16, color: theme.primaryText }}>Kode :</Text>
          </div>
          <VerticalSpace space="large" />
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
          <VerticalSpace space="large" />
          <Button onClick={handleCopyCode} style={{ padding: "4px 12px", fontSize: 12, height: "auto" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <IconDev16 />
              {copied ? "Tersalin!" : "Copy"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
