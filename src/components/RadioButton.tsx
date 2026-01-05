import { Button, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useState, useCallback, useEffect } from "preact/hooks";
import { InputField } from "./ui/InputField";
import { ColorPicker } from "./ui/ColorPicker";
import { SelectionChangeHandler } from "../types/types";
import { copyToClipboard } from "../utils/clipboardUtils";
import { normalizeHex } from "../utils/colorUtils";
import { Prism as SyntaxHighlighterComponent } from "react-syntax-highlighter";
// Gunakan casting 'as any' untuk menghindari error JSX
const SyntaxHighlighter = SyntaxHighlighterComponent as any;
import { shadesOfPurple, duotoneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
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
  // State Style Statis
  const [headingLabel, setHeadingLabel] = useState("Select Role");
  const [headingFontSize, setHeadingFontSize] = useState("14");
  const [headingFontWeight, setHeadingFontWeight] = useState("600");
  const [headingColor, setHeadingColor] = useState("#00BCFF");
  const [radioLabels, setRadioLabels] = useState("UI Designer,Frontend Developer");
  const [radioCount, setRadioCount] = useState("2");
  const [labelColor, setLabelColor] = useState("#00BCFF");
  const [labelFontSize, setLabelFontSize] = useState("14");
  const [labelFontWeight, setLabelFontWeight] = useState("500");
  const [labelFontWeightChecked, setLabelFontWeightChecked] = useState("600");
  const [labelColorChecked, setLabelColorChecked] = useState("#4F46E5");
  const [checkedColor, setCheckedColor] = useState("#4F46E5");
  const [gapBetweenItems, setGapBetweenItems] = useState("16");
  const [gapBetweenRadioAndLabel, setGapBetweenRadioAndLabel] = useState("12");
  const [radioSize, setRadioSize] = useState("20");
  const [borderWidth, setBorderWidth] = useState("2");
  const [defaultBorderColor, setDefaultBorderColor] = useState("#CBD5E1");
  const [innerDotSize, setInnerDotSize] = useState("10");

  // State Style Dinamis
  const [hoverBorderColor, setHoverBorderColor] = useState("#818CF8");
  const [transitionDuration, setTransitionDuration] = useState("200");

  const [htmltailwind, setHtmltailwind] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate Tailwind code
  const generateCode = useCallback(() => {
    // Parse values
    const gapValue = gapBetweenItems.replace(/px/gi, "").trim() || "16";
    const gapRadioLabel = gapBetweenRadioAndLabel.replace(/px/gi, "").trim() || "12";
    const radioSizeValue = radioSize.replace(/px/gi, "").trim() || "20";
    const borderWidthValue = borderWidth.replace(/px/gi, "").trim() || "2";
    const innerDotSizeValue = innerDotSize.replace(/px/gi, "").trim() || "10";
    const headingSize = headingFontSize.replace(/px/gi, "").trim() || "14";
    const labelSize = labelFontSize.replace(/px/gi, "").trim() || "14";
    const transitionMs = transitionDuration.replace(/ms/gi, "").trim() || "200";

    // Normalize hex colors
    const headingColorHex = normalizeHex(headingColor);
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

    // Generate heading
    const heading = `<p class="text-[${headingSize}px] font-[${headingFontWeight}] text-[${headingColorHex}]">${headingLabel}</p>`;

    // Generate radio items
    const radioItems = labels
      .map(
        (label, i) => `  <label class="flex items-center gap-[${gapRadioLabel}px] cursor-pointer group">
    <input type="radio" name="role_clean" class="peer sr-only" ${i === 0 ? "checked" : ""} />
    <div class="flex items-center justify-center w-[${radioSizeValue}px] h-[${radioSizeValue}px] rounded-[50%] border-[${borderWidthValue}px] border-[${defaultBorderColorHex}] group-hover:border-[${hoverBorderColorHex}] peer-checked:border-[${checkedColorHex}] transition-colors duration-[${transitionMs}ms] after:content-[''] after:w-[${innerDotSizeValue}px] after:h-[${innerDotSizeValue}px] after:rounded-[50%] after:bg-[${checkedColorHex}] after:scale-[0] peer-checked:after:scale-[1] after:transition-transform after:duration-[${transitionMs}ms]"></div>
    <span class="text-[${labelSize}px] font-[${labelFontWeight}] text-[${labelColorHex}] transition-colors duration-[${transitionMs}ms] peer-checked:text-[${labelColorCheckedHex}] peer-checked:font-[${labelFontWeightChecked}]">${label}</span>
  </label>`
      )
      .join("\n\n");

    const html = `<div class="space-y-[${gapValue}px]">
${heading}
${radioItems}
</div>`;

    const formattedHtml = formatHTML(html);
    setHtmltailwind(formattedHtml);
    return formattedHtml;
  }, [
    headingLabel,
    headingFontSize,
    headingFontWeight,
    headingColor,
    radioLabels,
    radioCount,
    labelColor,
    labelFontSize,
    labelFontWeight,
    labelFontWeightChecked,
    labelColorChecked,
    checkedColor,
    gapBetweenItems,
    gapBetweenRadioAndLabel,
    radioSize,
    borderWidth,
    defaultBorderColor,
    innerDotSize,
    hoverBorderColor,
    transitionDuration,
    normalizeHex,
  ]);

  useEffect(() => {
    generateCode();
  }, [generateCode]);

  useEffect(() => {
    on<SelectionChangeHandler>("SELECTION_CHANGE", data => {
      if (!data) {
        return;
      }
      try {
        const parsed = JSON.parse(data);
        if (parsed?.componentType === "radio-button") {
          if (parsed.headingLabel !== undefined) setHeadingLabel(parsed.headingLabel || "");
          if (parsed.headingFontSize !== undefined) setHeadingFontSize(parsed.headingFontSize || "14");
          if (parsed.headingFontWeight !== undefined) setHeadingFontWeight(parsed.headingFontWeight || "600");
          if (parsed.headingColor !== undefined) setHeadingColor(parsed.headingColor || "#334155");
          if (parsed.radioLabels !== undefined) setRadioLabels(parsed.radioLabels || "");
          if (parsed.radioCount !== undefined) setRadioCount(parsed.radioCount || "2");
          if (parsed.labelColor !== undefined) setLabelColor(parsed.labelColor || "#64748B");
          if (parsed.labelFontSize !== undefined) setLabelFontSize(parsed.labelFontSize || "14");
          if (parsed.labelFontWeight !== undefined) setLabelFontWeight(parsed.labelFontWeight || "500");
          if (parsed.labelFontWeightChecked !== undefined) setLabelFontWeightChecked(parsed.labelFontWeightChecked || "600");
          if (parsed.labelColorChecked !== undefined) setLabelColorChecked(parsed.labelColorChecked || "#4F46E5");
          if (parsed.checkedColor !== undefined) setCheckedColor(parsed.checkedColor || "#4F46E5");
          if (parsed.gapBetweenItems !== undefined) setGapBetweenItems(parsed.gapBetweenItems || "16");
          if (parsed.gapBetweenRadioAndLabel !== undefined) setGapBetweenRadioAndLabel(parsed.gapBetweenRadioAndLabel || "12");
          if (parsed.radioSize !== undefined) setRadioSize(parsed.radioSize || "20");
          if (parsed.borderWidth !== undefined) setBorderWidth(parsed.borderWidth || "2");
          if (parsed.defaultBorderColor !== undefined) setDefaultBorderColor(parsed.defaultBorderColor || "#CBD5E1");
          if (parsed.hoverBorderColor !== undefined) setHoverBorderColor(parsed.hoverBorderColor || "#818CF8");
          if (parsed.innerDotSize !== undefined) setInnerDotSize(parsed.innerDotSize || "10");
          if (parsed.transitionDuration !== undefined) setTransitionDuration(parsed.transitionDuration || "200");
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
    emit("CREATE_RADIO_BUTTON", {
      headingLabel,
      headingFontSize,
      headingFontWeight,
      headingColor,
      radioLabels,
      radioCount,
      labelColor,
      labelFontSize,
      labelFontWeight,
      labelFontWeightChecked,
      labelColorChecked,
      checkedColor,
      gapBetweenItems,
      gapBetweenRadioAndLabel,
      radioSize,
      borderWidth,
      defaultBorderColor,
      hoverBorderColor,
      innerDotSize,
      transitionDuration,
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
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
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
        <Text style={{ fontWeight: 600, fontSize: 18, color: theme.primaryText }}>Pengaturan :</Text>
      </div>
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Kolom 1: Style Statis */}
        <div style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto", flex: 1, minWidth: 260 }}>
          <VerticalSpace space="small" />
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, color: theme.primaryText }}>Style Statis :</Text>

          <VerticalSpace space="small" />
          <InputField label="Heading Radio Button :" value={headingLabel} onChange={setHeadingLabel} placeholder="Contoh: Select Role" />
          <InputField label="Ukuran font heading (px) :" value={headingFontSize} onChange={setHeadingFontSize} placeholder="Contoh: 14 (akan menjadi text-[14px])" />
          <InputField label="Font weight heading :" value={headingFontWeight} onChange={setHeadingFontWeight} placeholder="Contoh: 600 (akan menjadi font-[600])" />
          <ColorPicker label="Warna heading :" value={headingColor} onChange={setHeadingColor} />
          <InputField label="Gap antar radio button (px) :" value={gapBetweenItems} onChange={setGapBetweenItems} placeholder="Contoh: 16 (akan menjadi space-y-[16px])" />
          <InputField label="Jumlah Radio :" value={radioCount} onChange={setRadioCount} placeholder="Contoh: 2" />
          <InputField label="Label Radio (pisahkan dengan koma) :" value={radioLabels} onChange={setRadioLabels} placeholder="Contoh: UI Designer,Frontend Developer" />
          <InputField label="Gap antara radio dan label (px) :" value={gapBetweenRadioAndLabel} onChange={setGapBetweenRadioAndLabel} placeholder="Contoh: 12 (akan menjadi gap-[12px])" />
          <InputField label="Ukuran radio button (px) :" value={radioSize} onChange={setRadioSize} placeholder="Contoh: 20 (akan menjadi w-[20px] h-[20px])" />
          <InputField label="Border width (px) :" value={borderWidth} onChange={setBorderWidth} placeholder="Contoh: 2 (akan menjadi border-[2px])" />
          <ColorPicker label="Warna border default :" value={defaultBorderColor} onChange={setDefaultBorderColor} />
          <ColorPicker label="Warna checked :" value={checkedColor} onChange={setCheckedColor} />
          <InputField label="Ukuran inner dot (px) :" value={innerDotSize} onChange={setInnerDotSize} placeholder="Contoh: 10 (akan menjadi after:w-[10px] after:h-[10px])" />
          <ColorPicker label="Warna label :" value={labelColor} onChange={setLabelColor} />
          <InputField label="Ukuran font label (px) :" value={labelFontSize} onChange={setLabelFontSize} placeholder="Contoh: 14 (akan menjadi text-[14px])" />
          <InputField label="Font weight label default :" value={labelFontWeight} onChange={setLabelFontWeight} placeholder="Contoh: 500 (akan menjadi font-[500])" />
          <InputField label="Font weight label checked :" value={labelFontWeightChecked} onChange={setLabelFontWeightChecked} placeholder="Contoh: 600 (akan menjadi peer-checked:font-[600])" />
          <ColorPicker label="Warna label saat checked :" value={labelColorChecked} onChange={setLabelColorChecked} />
        </div>

        {/* Kolom 2: Style Dinamis */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, color: theme.primaryText }}>Style Dinamis :</Text>
          <VerticalSpace space="small" />
          <ColorPicker label="Warna border saat hover :" value={hoverBorderColor} onChange={setHoverBorderColor} />
          <InputField label="Durasi transisi (ms) :" value={transitionDuration} onChange={setTransitionDuration} placeholder="Contoh: 200 (akan menjadi duration-[200ms])" />
        </div>

        {/* Kolom 3: Live Preview & Kode */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 400, position: "sticky", top: 24, alignSelf: "flex-start", zIndex: 2, display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
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
            <div style={{ display: "flex", flexDirection: "column", gap: `${gapBetweenItems.replace(/px/gi, "") || 16}px` }}>
              {/* Heading */}
              <p style={{ fontSize: `${headingFontSize.replace(/px/gi, "") || 14}px`, fontWeight: Number(headingFontWeight) || 600, color: headingColor, margin: 0 }}>{headingLabel}</p>

              {/* Radio Buttons */}
              {labels.map((label, i) => (
                <label key={i} style={{ display: "flex", alignItems: "center", gap: `${gapBetweenRadioAndLabel.replace(/px/gi, "") || 12}px`, cursor: "pointer" }}>
                  <input type="radio" name="radio-preview" defaultChecked={i === 0} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: `${radioSize.replace(/px/gi, "") || 20}px`,
                      height: `${radioSize.replace(/px/gi, "") || 20}px`,
                      borderRadius: "50%",
                      border: `${borderWidth.replace(/px/gi, "") || 2}px solid ${defaultBorderColor}`,
                      position: "relative",
                      transition: `border-color ${transitionDuration.replace(/ms/gi, "") || 200}ms`,
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
                        width: `${innerDotSize.replace(/px/gi, "") || 10}px`,
                        height: `${innerDotSize.replace(/px/gi, "") || 10}px`,
                        borderRadius: "50%",
                        backgroundColor: checkedColor,
                        transform: `scale(${i === 0 ? 1 : 0})`,
                        transition: `transform ${transitionDuration.replace(/ms/gi, "") || 200}ms`,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: `${labelFontSize.replace(/px/gi, "") || 14}px`,
                      fontWeight: i === 0 ? Number(labelFontWeightChecked) || 600 : Number(labelFontWeight) || 500,
                      color: i === 0 ? labelColorChecked : labelColor,
                      transition: `color ${transitionDuration.replace(/ms/gi, "") || 200}ms, font-weight ${transitionDuration.replace(/ms/gi, "") || 200}ms`,
                    }}
                  >
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Button fullWidth secondary onClick={onBack}>
              Tutup
            </Button>
            <Button fullWidth onClick={handleCreateRadioButton}>
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
              overflow: "hidden",
            }}
          >
            <SyntaxHighlighter
              language="html"
              style={isDark ? shadesOfPurple : duotoneDark}
              wrapLines={true} // Mengaktifkan fitur wrap per baris
              lineProps={{ style: { whiteSpace: "pre-wrap", wordBreak: "break-all" } }} // Memaksa teks wrap
              customStyle={{
                margin: 0,
                padding: "16px",
                fontSize: "13px",
                background: "transparent",
                height: "100%",
                width: "100%",
                overflowX: "hidden", // Menghindari scroll horizontal
              }}
            >
              {htmltailwind}
            </SyntaxHighlighter>
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
