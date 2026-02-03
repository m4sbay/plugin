import { Button, IconClose16, IconDev16, IconWand16, Text, VerticalSpace } from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useState, useCallback, useEffect, useMemo } from "preact/hooks";
import { InputField } from "./ui/InputField";
import { ColorPicker } from "./ui/ColorPicker";
import { SelectionChangeHandler } from "../types/types";
import { copyToClipboard } from "../utils/clipboardUtils";
import { normalizeHex } from "../utils/colorUtils";
import { Prism as SyntaxHighlighterComponent } from "react-syntax-highlighter";
// Gunakan casting 'as any' untuk menghindari error JSX
const SyntaxHighlighter = SyntaxHighlighterComponent as any;
import { shadesOfPurple, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { formatHTML } from "../utils/htmlFormatter";

type RadioButtonProps = {
  onBack: () => void;
  isDark?: boolean;
};

export function RadioButton({ onBack, isDark = false }: RadioButtonProps) {
  const theme = {
    background: isDark ? "#0B1120" : "#FFFFFF",
    primaryText: isDark ? "#E2E8F0" : "#222222",
    secondaryText: isDark ? "#94A3B8" : "#6B7280",
    accent: isDark ? "#60A5FA" : "#007AFF",
    panelBorder: isDark ? "rgba(148, 163, 184, 0.35)" : "#e5e7eb",
    panelBackground: isDark ? "#111827" : "#f8f9fa",
    codeBackground: isDark ? "#0F172A" : "#f8f9fa",
    codeText: isDark ? "#E2E8F0" : "#222222",
  };
  // Constants untuk nilai default
  const DEFAULT_GAP_BETWEEN_ITEMS = "16";
  const DEFAULT_GAP_RADIO_LABEL = "12";
  const DEFAULT_BORDER_WIDTH = "2";
  const DEFAULT_LABEL_FONT_WEIGHT = "500";
  const DEFAULT_LABEL_FONT_WEIGHT_CHECKED = "600";
  const DEFAULT_TRANSITION_DURATION = "200";

  // --- Style Statis (urutan sesuai input di UI) ---
  const [radioCount, setRadioCount] = useState("1");
  const [radioLabels, setRadioLabels] = useState("UI Designer");
  const [radioSize, setRadioSize] = useState("15");
  const [defaultBorderColor, setDefaultBorderColor] = useState("#CBD5E1");
  const [checkedColor, setCheckedColor] = useState("#0B99FF");
  const [labelColorChecked, setLabelColorChecked] = useState("#0B99FF");
  const [labelColor, setLabelColor] = useState("#ADDBFB");
  const [labelFontSize, setLabelFontSize] = useState("14");

  // --- Style Dinamis ---
  const [hoverBorderColor, setHoverBorderColor] = useState("#818CF8");

  // --- UI state ---
  const [htmltailwind, setHtmltailwind] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate HTML string menggunakan useMemo
  const htmlCode = useMemo(() => {
    // Parse values dengan default
    const gapValue = DEFAULT_GAP_BETWEEN_ITEMS;
    const gapRadioLabel = DEFAULT_GAP_RADIO_LABEL;
    const radioSizeValue = radioSize.replace(/px/gi, "").trim() || "20";
    const borderWidthValue = DEFAULT_BORDER_WIDTH;
    // Auto-calculate inner dot size: 50% dari radio size
    const radioSizeNum = Number(radioSizeValue) || 20;
    const innerDotSizeValue = Math.round(radioSizeNum * 0.5).toString();
    const labelSize = labelFontSize.replace(/px/gi, "").trim() || "14";
    const transitionMs = DEFAULT_TRANSITION_DURATION;

    // Normalize hex colors
    const defaultBorderColorHex = normalizeHex(defaultBorderColor);
    const hoverBorderColorHex = normalizeHex(hoverBorderColor);
    const checkedColorHex = normalizeHex(checkedColor);
    const labelColorHex = normalizeHex(labelColor);
    const labelColorCheckedHex = normalizeHex(labelColorChecked);

    const count = parseInt(radioCount) || 1;
    const labels = radioLabels
      .split(",")
      .map(l => l.trim())
      .slice(0, count);

    // Generate radio items
    const radioItems = labels
      .map(
        (label, i) => `  <label class="flex items-center gap-[${gapRadioLabel}px] cursor-pointer group">
    <input type="radio" name="role_clean" class="peer sr-only" ${i === 0 ? "checked" : ""} />
    <div class="flex items-center justify-center w-[${radioSizeValue}px] h-[${radioSizeValue}px] rounded-[50%] border-[${borderWidthValue}px] border-[${defaultBorderColorHex}] group-hover:border-[${hoverBorderColorHex}] peer-checked:border-[${checkedColorHex}] transition-colors duration-[${transitionMs}ms] after:content-[''] after:w-[${innerDotSizeValue}px] after:h-[${innerDotSizeValue}px] after:rounded-[50%] after:bg-[${checkedColorHex}] after:scale-[0] peer-checked:after:scale-[1] after:transition-transform after:duration-[${transitionMs}ms]"></div>
    <span class="text-[${labelSize}px] font-[${DEFAULT_LABEL_FONT_WEIGHT}] text-[${labelColorHex}] transition-colors duration-[${transitionMs}ms] peer-checked:text-[${labelColorCheckedHex}] peer-checked:font-[${DEFAULT_LABEL_FONT_WEIGHT_CHECKED}]">${label}</span>
  </label>`,
      )
      .join("\n\n");

    return `<div class="space-y-[${gapValue}px]">${radioItems}</div>`;
  }, [radioLabels, radioCount, labelColor, labelFontSize, labelColorChecked, checkedColor, radioSize, defaultBorderColor, hoverBorderColor]);

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
        return;
      }
      try {
        const parsed = JSON.parse(data);
        if (parsed?.componentType === "radio-button") {
          if (parsed.radioLabels !== undefined) setRadioLabels(parsed.radioLabels || "");
          if (parsed.radioCount !== undefined) setRadioCount(parsed.radioCount || "2");
          if (parsed.labelColor !== undefined) setLabelColor(parsed.labelColor || "#64748B");
          if (parsed.labelFontSize !== undefined) setLabelFontSize(parsed.labelFontSize || "14");
          if (parsed.labelColorChecked !== undefined) setLabelColorChecked(parsed.labelColorChecked || "#4F46E5");
          if (parsed.checkedColor !== undefined) setCheckedColor(parsed.checkedColor || "#4F46E5");
          if (parsed.radioSize !== undefined) setRadioSize(parsed.radioSize || "20");
          if (parsed.defaultBorderColor !== undefined) setDefaultBorderColor(parsed.defaultBorderColor || "#CBD5E1");
          if (parsed.hoverBorderColor !== undefined) setHoverBorderColor(parsed.hoverBorderColor || "#818CF8");
          if (parsed.htmltailwind !== undefined) setHtmltailwind(parsed.htmltailwind || "");
        }
      } catch (error) {
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

  // Emit ke Figma
  const handleCreateRadioButton = () => {
    // Auto-calculate inner dot size
    const radioSizeNum = Number(radioSize.replace(/px/gi, "").trim()) || 20;
    const innerDotSizeValue = Math.round(radioSizeNum * 0.5).toString();

    emit("CREATE_RADIO_BUTTON", {
      radioLabels,
      radioCount,
      labelColor,
      labelFontSize,
      labelFontWeight: DEFAULT_LABEL_FONT_WEIGHT,
      labelFontWeightChecked: DEFAULT_LABEL_FONT_WEIGHT_CHECKED,
      labelColorChecked,
      checkedColor,
      gapBetweenItems: DEFAULT_GAP_BETWEEN_ITEMS,
      gapBetweenRadioAndLabel: DEFAULT_GAP_RADIO_LABEL,
      radioSize,
      borderWidth: DEFAULT_BORDER_WIDTH,
      defaultBorderColor,
      hoverBorderColor,
      innerDotSize: innerDotSizeValue,
      transitionDuration: DEFAULT_TRANSITION_DURATION,
      htmltailwind,
    });
  };

  const count = parseInt(radioCount) || 1;
  const labels = radioLabels
    .split(",")
    .map(l => l.trim())
    .slice(0, count);

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
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", marginRight: 8, padding: 0, display: "flex", alignItems: "center" }}>
            <svg width="15" height="20" viewBox="0 0 20 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.57426 13.7604C1.58095 13.5264 1.62774 13.3125 1.71464 13.1187C1.80155 12.9248 1.93524 12.7376 2.11573 12.5571L12.1629 2.8308C12.4504 2.54335 12.8047 2.39963 13.2258 2.39963C13.5066 2.39963 13.7606 2.46648 13.9879 2.60017C14.2218 2.73387 14.4057 2.91436 14.5394 3.14164C14.6798 3.36892 14.7499 3.62294 14.7499 3.9037C14.7499 4.31816 14.5929 4.68248 14.2787 4.99666L5.19407 13.7504L14.2787 22.5141C14.5929 22.835 14.7499 23.1993 14.7499 23.6071C14.7499 23.8945 14.6798 24.1519 14.5394 24.3792C14.4057 24.6064 14.2218 24.7869 13.9879 24.9206C13.7606 25.061 13.5066 25.1312 13.2258 25.1312C12.8047 25.1312 12.4504 24.9841 12.1629 24.69L2.11573 14.9637C1.92856 14.7832 1.79152 14.596 1.70462 14.4021C1.61771 14.2016 1.57426 13.9877 1.57426 13.7604Z"
                fill={theme.accent}
              />
            </svg>
          </button>
          <Text style={{ fontSize: 28, fontWeight: 600, color: theme.primaryText }}>Radio Button</Text>
        </div>
      </div>
      <VerticalSpace space="large" />
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Kolom 1: Style Statis */}
        <div style={{ maxHeight: "calc(100vh - 120px)",  flex: 1, minWidth: 260 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, color: theme.primaryText }}>Style Statis :</Text>
          <VerticalSpace space="large" />
          <InputField label="Jumlah Radio :" value={radioCount} onChange={setRadioCount} placeholder="Contoh: 2" />
          <InputField label="Label Radio (pisahkan dengan koma) :" value={radioLabels} onChange={setRadioLabels} placeholder="Contoh: UI Designer,Frontend Developer" />
          <InputField label="Ukuran radio button (px) :" value={radioSize} onChange={setRadioSize} placeholder="Contoh: 20 (akan menjadi w-[20px] h-[20px])" />
          <ColorPicker label="Warna border default :" value={defaultBorderColor} onChange={setDefaultBorderColor} />
          <ColorPicker label="Warna checked :" value={checkedColor} onChange={setCheckedColor} />
          <ColorPicker label="Warna label checked :" value={labelColorChecked} onChange={setLabelColorChecked} />
          <ColorPicker label="Warna label unchecked :" value={labelColor} onChange={setLabelColor} />
          <InputField label="Ukuran font label (px) :" value={labelFontSize} onChange={setLabelFontSize} placeholder="Contoh: 14 (akan menjadi text-[14px])" />
        </div>

        {/* Kolom 2: Style Dinamis */}
        <div style={{ flex: 0.3, minWidth: 160 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, color: theme.primaryText }}>Style Dinamis :</Text>
          <VerticalSpace space="large" />
          <ColorPicker label="Warna border saat hover :" value={hoverBorderColor} onChange={setHoverBorderColor} />
        </div>

        {/* Kolom 3: Live Preview & Kode */}
        <div style={{ flex: 1.9, minWidth: 320, maxWidth: 500, display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
          <Text style={{ fontWeight: 600, fontSize: 18, color: theme.primaryText }}>Live Preview :</Text>
          <VerticalSpace space="large" />
          <div
            style={{
              border: `1px solid ${theme.panelBorder}`,
              borderRadius: 8,
              background: theme.panelBackground,
              minHeight: 120,
              padding: 24,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: `${DEFAULT_GAP_BETWEEN_ITEMS}px` }}>
              {/* Radio Buttons */}
              {labels.map((label, i) => {
                const radioSizeNum = Number(radioSize.replace(/px/gi, "") || 20);
                const innerDotSizeValue = Math.round(radioSizeNum * 0.5);

                return (
                  <label key={i} style={{ display: "flex", alignItems: "center", gap: `${DEFAULT_GAP_RADIO_LABEL}px`, cursor: "pointer" }}>
                    <input type="radio" name="radio-preview" defaultChecked={i === 0} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: `${radioSizeNum}px`,
                        height: `${radioSizeNum}px`,
                        borderRadius: "50%",
                        border: `${DEFAULT_BORDER_WIDTH}px solid ${defaultBorderColor}`,
                        position: "relative",
                        transition: `border-color ${DEFAULT_TRANSITION_DURATION}ms`,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = hoverBorderColor;
                      }}
                      onMouseLeave={e => {
                        const radio = e.currentTarget.previousElementSibling as HTMLInputElement;
                        if (radio?.checked) {
                          e.currentTarget.style.borderColor = checkedColor;
                        } else {
                          e.currentTarget.style.borderColor = defaultBorderColor;
                        }
                      }}
                    >
                      <div
                        style={{
                          width: `${innerDotSizeValue}px`,
                          height: `${innerDotSizeValue}px`,
                          borderRadius: "50%",
                          backgroundColor: checkedColor,
                          transform: `scale(${i === 0 ? 1 : 0})`,
                          transition: `transform ${DEFAULT_TRANSITION_DURATION}ms`,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: `${labelFontSize.replace(/px/gi, "") || 14}px`,
                        fontWeight: i === 0 ? Number(DEFAULT_LABEL_FONT_WEIGHT_CHECKED) : Number(DEFAULT_LABEL_FONT_WEIGHT),
                        color: i === 0 ? labelColorChecked : labelColor,
                        transition: `color ${DEFAULT_TRANSITION_DURATION}ms, font-weight ${DEFAULT_TRANSITION_DURATION}ms`,
                      }}
                    >
                      {label}
                    </span>
                  </label>
                );
              })}
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
            <Button fullWidth onClick={handleCreateRadioButton}>
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
