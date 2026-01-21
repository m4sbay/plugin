import { Button, Dropdown, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useState, useCallback, useEffect } from "preact/hooks";
import { InputField } from "./ui/InputField";
import { ColorPicker } from "./ui/ColorPicker";
import { SelectionChangeHandler } from "../types/types";
import { Prism as SyntaxHighlighterComponent } from "react-syntax-highlighter";
// Gunakan casting 'as any' untuk menghindari error JSX
const SyntaxHighlighter = SyntaxHighlighterComponent as any;
import { shadesOfPurple, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { formatHTML } from "../utils/htmlFormatter";

type ProgressIndicatorCreatorProps = {
  onBack: () => void;
  isDark?: boolean;
};

export function ProgressIndicatorCreator({ onBack, isDark = false }: ProgressIndicatorCreatorProps) {
  const theme = {
    background: isDark ? "#0B1120" : "#FFFFFF",
    primaryText: isDark ? "#E2E8F0" : "#222222",
    secondaryText: isDark ? "#A1A1AA" : "#6B7280",
    accent: isDark ? "#60A5FA" : "#007AFF",
    panelBorder: isDark ? "rgba(148, 163, 184, 0.35)" : "#e5e7eb",
    panelBackground: isDark ? "#111827" : "#f8f9fa",
    codeBackground: isDark ? "#0F172A" : "#f8f9fa",
    codeText: isDark ? "#E2E8F0" : "#222222",
  };
  // State untuk Progress Indicator
  const [progressValue, setProgressValue] = useState("50");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("12");
  const [progressColor, setProgressColor] = useState("#00BCFF");
  const [bgColor, setBgColor] = useState("#E5E7EB");
  const [borderRadius, setBorderRadius] = useState("100");
  const [percentageTextColor, setPercentageTextColor] = useState("#00BCFF");
  const [percentageMargin, setPercentageMargin] = useState("12");
  const [showPercentage, setShowPercentage] = useState("yes");

  const showPercentageOptions = [
    { value: "yes", text: "Ya" },
    { value: "no", text: "Tidak" },
  ];

  const [htmltailwind, setHtmltailwind] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate Tailwind code
  const generateCode = useCallback(async () => {
    const isFullWidth = width.trim() === "";
    const classes = isFullWidth ? `bg-[${bgColor}] rounded-[${borderRadius}px] w-full h-[${height}px]` : `bg-[${bgColor}] rounded-[${borderRadius}px] w-[${width}px] h-[${height}px]`;
    const innerClasses = `bg-[${progressColor}] h-full rounded-[${borderRadius}px] transition-all duration-300`;
    const marginValue = showPercentage === "yes" ? percentageMargin : "0";
    const percentage = showPercentage === "yes" ? `<span class="text-sm" style="color:${percentageTextColor}; margin-left:${marginValue}px">${progressValue}%</span>` : "";
    const html = `<div class="flex items-center"><div class="${classes} overflow-hidden"><div class="${innerClasses}" style="width:${progressValue}%"></div></div>${percentage}</div>`;
    const formattedHtml = await formatHTML(html);
    setHtmltailwind(formattedHtml);
  }, [progressValue, width, height, progressColor, bgColor, borderRadius, percentageTextColor, percentageMargin, showPercentage]);

  useEffect(() => {
    (async () => {
      await generateCode();
    })();
  }, [generateCode]);

  useEffect(() => {
    on<SelectionChangeHandler>("SELECTION_CHANGE", data => {
      if (!data) {
        return;
      }
      try {
        const parsed = JSON.parse(data);
        if (parsed?.componentType === "progress-indicator") {
          if (parsed.progressValue !== undefined) setProgressValue(parsed.progressValue || "50");
          if (parsed.width !== undefined) setWidth(parsed.width || "");
          if (parsed.height !== undefined) setHeight(parsed.height || "12");
          if (parsed.progressColor !== undefined) setProgressColor(parsed.progressColor || "#00BCFF");
          if (parsed.bgColor !== undefined) setBgColor(parsed.bgColor || "#E5E7EB");
          if (parsed.borderRadius !== undefined) setBorderRadius(parsed.borderRadius || "100");
          if (parsed.percentageTextColor !== undefined) setPercentageTextColor(parsed.percentageTextColor || "#00BCFF");
          if (parsed.percentageMargin !== undefined) setPercentageMargin(parsed.percentageMargin || "12");
          if (parsed.showPercentage !== undefined) setShowPercentage(parsed.showPercentage || "yes");
          if (parsed.htmltailwind !== undefined) setHtmltailwind(parsed.htmltailwind || "");
        }
      } catch (error) {
        setHtmltailwind(data);
      }
    });
  }, []);

  const handleCopyCode = useCallback(async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(htmltailwind);
      } else {
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

  // Emit ke Figma
  const handleCreateProgressIndicator = () => {
    emit("CREATE_PROGRESS_INDICATOR", {
      progressValue,
      progressType: "bar",
      width,
      height,
      progressColor,
      bgColor,
      borderRadius,
      percentageTextColor,
      percentageMargin,
      showPercentage,
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
        <Text style={{ fontSize: 28, fontWeight: 600, color: theme.primaryText }}>Progress Indicator</Text>
      </div>
      <Text style={{ fontWeight: 600, fontSize: 18, color: theme.primaryText }}>Style Statis :</Text>
      <VerticalSpace space="small" />
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Kolom 1: Style */}
        <div style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto", flex: 1, minWidth: 260, paddingRight: 16 }}>
          <VerticalSpace space="small" />
          <Text style={{ fontWeight: 400, fontSize: 11, marginBottom: 10, color: theme.secondaryText }}>Tampilkan Presentase :</Text>
          <Dropdown options={showPercentageOptions} value={showPercentage} onValueChange={setShowPercentage} />
          {showPercentage === "yes" && (
            <div>
              <VerticalSpace space="large" />
              <ColorPicker label="Warna teks presentase :" value={percentageTextColor} onChange={setPercentageTextColor} />
              <VerticalSpace space="small" />
              <InputField label="Jarak dari progress bar (px) :" value={percentageMargin} onChange={setPercentageMargin} placeholder="Contoh: 12" />
            </div>
          )}
          <VerticalSpace space="small" />
          <InputField label="Nilai Progress (%) :" value={progressValue} onChange={setProgressValue} placeholder="Contoh: 60" />
          <VerticalSpace space="small" />
          <InputField label="Lebar (px) :" value={width} onChange={setWidth} placeholder="Contoh: 300 (Kosongkan untuk full width)" />
          <VerticalSpace space="small" />
          <InputField label="Tinggi (px) :" value={height} onChange={setHeight} placeholder="Contoh: 12" />
          <VerticalSpace space="small" />
          <ColorPicker label="Warna progress :" value={progressColor} onChange={setProgressColor} />
          <VerticalSpace space="small" />
          <ColorPicker label="Warna latar :" value={bgColor} onChange={setBgColor} />
          <VerticalSpace space="small" />
          <InputField label="Border radius (px) :" value={borderRadius} onChange={setBorderRadius} placeholder="Contoh: 100" />
          <VerticalSpace space="small" />
        </div>

        {/* Kolom 2: Live Preview & Kode */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 500, position: "sticky", top: 24, alignSelf: "flex-start", zIndex: 2, display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, color: theme.primaryText }}>Live Preview :</Text>
          <div
            style={{
              border: `1px solid ${theme.panelBorder}`,
              borderRadius: 8,
              background: theme.panelBackground,
              flex: 1,
              minHeight: 0,
              marginBottom: 24,
              padding: 24,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
              overflow: "auto"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: width?.trim() === "" ? "flex-start" : "center",
                width: width?.trim() === "" ? "100%" : "auto",
              }}
            >
              <div
                style={{
                  width: width?.trim() === "" ? "100%" : width ? `${width}px` : "300px",
                  height: height ? `${height}px` : "12px",
                  background: bgColor,
                  borderRadius: `${borderRadius}px`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progressValue}%`,
                    height: "100%",
                    background: progressColor,
                    borderRadius: `${borderRadius}px`,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              {showPercentage === "yes" && <span style={{ marginLeft: `${percentageMargin}px`, fontSize: 14, color: percentageTextColor }}>{progressValue}%</span>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Button fullWidth danger onClick={onBack}>
              Tutup
            </Button>
            <Button fullWidth onClick={handleCreateProgressIndicator}>
              Buat
            </Button>
          </div>
          <Text style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, color: theme.primaryText }}>Kode :</Text>
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
