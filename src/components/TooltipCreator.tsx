import { Button, IconClose16, IconDev16, IconWand16, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useState, useCallback, useEffect, useMemo } from "preact/hooks";
import { InputField } from "./ui/InputField";
import { ColorPicker } from "./ui/ColorPicker";
import { SelectionChangeHandler } from "../types/types";
import { Prism as SyntaxHighlighterComponent } from "react-syntax-highlighter";
// Gunakan casting 'as any' untuk menghindari error JSX
const SyntaxHighlighter = SyntaxHighlighterComponent as any;
import { shadesOfPurple, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { formatHTML } from "../utils/htmlFormatter";
import { copyToClipboard } from "../utils/clipboardUtils";

type TooltipCreatorProps = {
  onBack: () => void;
  isDark?: boolean;
};

export function TooltipCreator({ onBack, isDark = false }: TooltipCreatorProps) {
  const theme = {
    background: isDark ? "#0B1120" : "#FFFFFF",
    primaryText: isDark ? "#E2E8F0" : "#222222",
    accent: isDark ? "#60A5FA" : "#007AFF",
    panelBorder: isDark ? "rgba(148, 163, 184, 0.35)" : "#e5e7eb",
    panelBackground: isDark ? "#111827" : "#f8f9fa",
    codeBackground: isDark ? "#0F172A" : "#f8f9fa",
    codeText: isDark ? "#E2E8F0" : "#222222",
  };
  // --- Properti (urutan sesuai input di UI) ---
  const [tooltipText, setTooltipText] = useState("Click Me");
  const [bgColor, setBgColor] = useState("#00BCFF");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState("14");
  const [padding, setPadding] = useState("14,8");
  const [borderRadius, setBorderRadius] = useState("8");
  const [marginBottom, setMarginBottom] = useState("16");

  // --- UI state ---
  const [htmltailwind, setHtmltailwind] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate HTML string menggunakan useMemo
  const htmlCode = useMemo(() => {
    // Parse values
    const fontSizeValue = fontSize.replace(/px/gi, "").trim() || "14";
    const paddingX = padding.split(",")[0]?.trim().replace(/px/gi, "") || "8";
    const paddingY = padding.split(",")[1]?.trim().replace(/px/gi, "") || "12";
    const borderRadiusValue = borderRadius.replace(/px/gi, "").trim() || "8";
    const marginBottomValue = marginBottom.replace(/px/gi, "").trim() || "16";

    return `<!-- Tooltip --><div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-[${marginBottomValue}px] hidden group-hover:block w-max max-w-xs px-[${paddingX}px] py-[${paddingY}px] text-[${fontSizeValue}px] text-[${textColor}] bg-[${bgColor}] rounded-[${borderRadiusValue}px] z-10">${tooltipText}<div class="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[${bgColor}] rotate-45 -mt-1"></div></div><!-- Pastikan komponen yang ingin diberi tooltip terbungkus dalam "div" dengan class "relative" dan "group" -->`;
  }, [tooltipText, bgColor, textColor, fontSize, padding, borderRadius, marginBottom]);

  // Format HTML secara async
  useEffect(() => {
    (async () => {
      const formattedHtml = await formatHTML(htmlCode);
      setHtmltailwind(formattedHtml);
    })();
  }, [htmlCode]);

  useEffect(() => {
    on<SelectionChangeHandler>("SELECTION_CHANGE", data => {
      if (!data) {
        setHtmltailwind("");
        return;
      }
      try {
        const parsed = JSON.parse(data);
        if (parsed?.componentType === "tooltip") {
          if (parsed.tooltipText !== undefined) setTooltipText(parsed.tooltipText || "Click Me");
          if (parsed.bgColor !== undefined) setBgColor(parsed.bgColor || "#00BCFF");
          if (parsed.textColor !== undefined) setTextColor(parsed.textColor || "#FFFFFF");
          if (parsed.fontSize !== undefined) setFontSize(parsed.fontSize || "14");
          if (parsed.padding !== undefined) setPadding(parsed.padding || "8,12");
          if (parsed.borderRadius !== undefined) setBorderRadius(parsed.borderRadius || "8");
          if (parsed.marginBottom !== undefined) setMarginBottom(parsed.marginBottom || "16");
          if (parsed.htmltailwind !== undefined) setHtmltailwind(parsed.htmltailwind || "");
        }
      } catch (error) {
        setHtmltailwind(data);
      }
    });
  }, []);

  // Emit ke Figma
  const handleCreateTooltip = () => {
    emit("CREATE_TOOLTIP", {
      tooltipText,
      bgColor,
      textColor,
      fontSize,
      padding,
      borderRadius,
      marginBottom,
      htmltailwind,
    });
  };

  const handleCopyCode = useCallback(async () => {
    const success = await copyToClipboard(htmltailwind);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [htmltailwind]); 

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
        <Text style={{ fontSize: 28, fontWeight: 600, color: theme.primaryText }}>Tooltip</Text>
      </div>
      <VerticalSpace space="large" />
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start", paddingTop: 24 }}>
        {/* Kolom 1: Style */}
        <div style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto", flex: 1, minWidth: 260, paddingTop: 12 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, color: theme.primaryText }}>Style Statis :</Text>
          <VerticalSpace space="large" />
          <InputField label="Teks Tooltip :" value={tooltipText} onChange={setTooltipText} placeholder="Contoh: Click Me" />
          <ColorPicker label="Warna latar tooltip :" value={bgColor} onChange={setBgColor} />
          <ColorPicker label="Warna teks tooltip :" value={textColor} onChange={setTextColor} />
          <InputField label="Ukuran teks tooltip (px) :" value={fontSize} onChange={setFontSize} placeholder="Contoh: 14" />
          <InputField label="Padding (x,y) :" value={padding} onChange={setPadding} placeholder="Contoh: 8,12" />
          <InputField label="Border radius (px) :" value={borderRadius} onChange={setBorderRadius} placeholder="Contoh: 8" />
          <InputField label="Jarak dari komponen (px) :" value={marginBottom} onChange={setMarginBottom} placeholder="Contoh: 16" />
        </div>

        {/* Kolom 2: Live Preview & Kode */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 500, display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", paddingTop: 12 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, color: theme.primaryText }}>Live Preview :</Text>
          <VerticalSpace space="large" />
          <div
            style={{
              border: `1px solid ${theme.panelBorder}`,
              borderRadius: 8,
              background: theme.panelBackground,
              flex: 1,
              minHeight: 0,
              padding: 24,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
          >
            <div style={{ position: "relative", display: "inline-block" }}>
              {/* Tooltip Preview */}
              <div
                style={{
                  position: "relative",
                  bottom: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginBottom: "16px",
                  background: bgColor,
                  color: textColor,
                  fontSize: fontSize ? `${fontSize.replace(/px/gi, "").trim()}px` : "14px",
                  padding: padding ? `${padding.split(",")[1]?.trim().replace(/px/gi, "") || "12"}px ${padding.split(",")[0]?.trim().replace(/px/gi, "") || "8"}px` : "12px 8px",
                  borderRadius: borderRadius ? `${borderRadius.replace(/px/gi, "").trim() || "8"}px` : "8px",
                  whiteSpace: "nowrap",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  zIndex: 10,
                  width: "auto",
                  maxWidth: "100%",
                }}
              >
                {tooltipText}
                {/* Arrow */}
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%) rotate(45deg)",
                    width: "8px",
                    height: "8px",
                    background: bgColor,
                    marginTop: "-4px",
                  }}
                />
              </div>
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
            <Button fullWidth onClick={handleCreateTooltip}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <IconWand16 />
                Buat
              </span>
            </Button>
          </div>
          <VerticalSpace space="large" />
          <Text style={{ fontWeight: 600, fontSize: 16, color: theme.primaryText }}>Kode :</Text>
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
