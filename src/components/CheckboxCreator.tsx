import { Button, IconClose16, IconDev16, IconWand16, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useState, useCallback, useEffect, useMemo } from "preact/hooks";
import { SelectionChangeHandler } from "../types/types";
import { InputField } from "./ui/InputField";
import { ColorPicker } from "./ui/ColorPicker";
import { copyToClipboard } from "../utils/clipboardUtils";
import { normalizeHex } from "../utils/colorUtils";
import { shadesOfPurple, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighterComponent } from "react-syntax-highlighter";
// Gunakan casting 'as any' untuk menghindari error JSX
const SyntaxHighlighter = SyntaxHighlighterComponent as any;
import { formatHTML } from "../utils/htmlFormatter";

type CheckboxCreatorProps = {
  onBack: () => void;
  isDark?: boolean;
};

export function CheckboxCreator({ onBack, isDark = false }: CheckboxCreatorProps) {
  const theme = {
    background: isDark ? "#0B1120" : "#FFFFFF",
    primaryText: isDark ? "#E2E8F0" : "#222222",
    secondaryText: isDark ? "#94A3B8" : "#555555",
    accent: isDark ? "#60A5FA" : "#007AFF",
    panelBorder: isDark ? "rgba(148, 163, 184, 0.4)" : "#e5e7eb",
    panelBackground: isDark ? "#111827" : "#f8f9fa",
    codeBackground: isDark ? "#0F172A" : "#f8f9fa",
    codeText: isDark ? "#E2E8F0" : "#222222",
    buttonShadow: isDark ? "0 10px 24px rgba(15, 23, 42, 0.55)" : "0 2px 8px rgba(0,0,0,0.04)",
  };
  // --- Style Statis (urutan sesuai input di UI) ---
  const [checkboxLabel, setCheckboxLabel] = useState("Setuju");
  const [labelColor, setLabelColor] = useState("#3B82F6");
  const [labelFontSize, setLabelFontSize] = useState("14");
  const [labelFontWeight, setLabelFontWeight] = useState("500");
  const [checkboxDescription, setCheckboxDescription] = useState("Ya saya setuju dengan syarat dan ketentuan.");
  const [descriptionColor, setDescriptionColor] = useState("#9CA3AF");
  const [descriptionFontSize, setDescriptionFontSize] = useState("14");
  const [checkboxSize, setCheckboxSize] = useState("15");
  const [borderRadius, setBorderRadius] = useState("4");
  const [uncheckedBgColor, setUncheckedBgColor] = useState("#FFFFFF");
  const [checkedBgColor, setCheckedBgColor] = useState("#3B82F6");
  const [gapBetweenCheckboxLabel, setGapBetweenCheckboxLabel] = useState("8");
  const [checkmarkSize, setCheckmarkSize] = useState("12");
  const [checkmarkColor, setCheckmarkColor] = useState("#FFFFFF");

  // --- UI state ---
  const [htmltailwind, setHtmltailwind] = useState("");
  const [copied, setCopied] = useState(false);
  const [checkedStates, setCheckedStates] = useState<boolean[]>([]);

  // Generate HTML string menggunakan useMemo
  const htmlCode = useMemo(() => {
    // Parse values
    const checkboxSizeValue = checkboxSize.replace(/px/gi, "").trim() || "20";
    const gapValue = gapBetweenCheckboxLabel.replace(/px/gi, "").trim();
    const gapPx = gapValue ? Number(gapValue) || 0 : 0;
    const checkboxSizePx = Number(checkboxSizeValue) || 20;
    const descriptionIndent = checkboxSizePx + gapPx;
    const borderRadiusValue = borderRadius.replace(/px/gi, "").trim() || "4";
    const checkmarkSizeValue = checkmarkSize.replace(/px/gi, "").trim() || "14";

    // Normalize hex colors
    const checkedBgColorHex = normalizeHex(checkedBgColor);
    const checkmarkColorHex = normalizeHex(checkmarkColor);
    const uncheckedBgColorHex = normalizeHex(uncheckedBgColor);

    // Classes untuk checkbox input
    const checkboxClasses = `peer h-[${checkboxSizeValue}px] w-[${checkboxSizeValue}px] cursor-pointer transition-all appearance-none rounded-[${borderRadiusValue}px] shadow hover:shadow-md checked:bg-[${checkedBgColorHex}] bg-[${uncheckedBgColorHex}] focus:outline-none`;

    // Normalize colors untuk label dan deskripsi
    const labelColorHex = normalizeHex(labelColor);
    const descriptionColorHex = normalizeHex(descriptionColor);

    const label = checkboxLabel || "Checkbox";
    const description = checkboxDescription || "";

    const checkboxItem = `  <div class="flex flex-col gap-[4px]">
  <div class="inline-flex items-center">
    <label class="flex items-center cursor-pointer relative">
      <input type="checkbox" checked class="${checkboxClasses}" />
      <span class="absolute text-[${checkmarkColorHex}] opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-[${checkmarkSizeValue}px] w-[${checkmarkSizeValue}px]" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
      </span>
    </label>
    <div class="ml-[${gapBetweenCheckboxLabel}px]">
      <span class="text-[${labelFontSize}px] font-[${labelFontWeight}] text-[${labelColorHex}]">${label}</span>
    </div>
  </div>
  ${description ? `<div class="ml-[${descriptionIndent}px]"><p class="text-[${descriptionFontSize}px] text-[${descriptionColorHex}]">${description}</p></div>` : ""}
</div>`;

    return `<div>${checkboxItem}</div>`;
  }, [
    checkboxLabel,
    checkboxDescription,
    labelColor,
    labelFontSize,
    labelFontWeight,
    descriptionColor,
    descriptionFontSize,
    checkboxSize,
    borderRadius,
    checkedBgColor,
    gapBetweenCheckboxLabel,
    checkmarkSize,
    checkmarkColor,
    uncheckedBgColor,
  ]);

  // Format HTML secara async
  useEffect(() => {
    (async () => {
      const formattedHtml = await formatHTML(htmlCode);
      setHtmltailwind(formattedHtml);
    })();
  }, [htmlCode]);

  // Load data when checkbox component is selected
  useEffect(() => {
    on<SelectionChangeHandler>("SELECTION_CHANGE", data => {
      if (data) {
        try {
          // Try to parse as JSON (checkbox data)
          const checkboxData = JSON.parse(data);
          if (checkboxData.htmltailwind) {
            // Load all checkbox data
            setHtmltailwind(checkboxData.htmltailwind);
            if (checkboxData.checkboxLabel) setCheckboxLabel(checkboxData.checkboxLabel);
            if (checkboxData.checkboxDescription) setCheckboxDescription(checkboxData.checkboxDescription);
            if (checkboxData.labelColor) setLabelColor(checkboxData.labelColor);
            if (checkboxData.labelFontSize) setLabelFontSize(checkboxData.labelFontSize);
            if (checkboxData.labelFontWeight) setLabelFontWeight(checkboxData.labelFontWeight);
            if (checkboxData.checkboxSize) setCheckboxSize(checkboxData.checkboxSize);
            if (checkboxData.borderRadius) setBorderRadius(checkboxData.borderRadius);
            if (checkboxData.checkedBgColor) setCheckedBgColor(checkboxData.checkedBgColor);
            if (checkboxData.uncheckedBgColor) setUncheckedBgColor(checkboxData.uncheckedBgColor);
            if (checkboxData.gapBetweenCheckboxLabel) setGapBetweenCheckboxLabel(checkboxData.gapBetweenCheckboxLabel);
            if (checkboxData.checkmarkSize) setCheckmarkSize(checkboxData.checkmarkSize);
            if (checkboxData.checkmarkColor) setCheckmarkColor(checkboxData.checkmarkColor);
            if (checkboxData.checkboxDescriptions) setCheckboxDescription(checkboxData.checkboxDescriptions); // fallback lama
            if (checkboxData.descriptionColor) setDescriptionColor(checkboxData.descriptionColor);
            if (checkboxData.descriptionFontSize) setDescriptionFontSize(checkboxData.descriptionFontSize);
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
    const success = await copyToClipboard(htmltailwind);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [htmltailwind]);

  // Emit ke Figma
  const handleCreateCheckbox = () => {
    emit("CREATE_CHECKBOX", {
      checkboxLabel,
      checkboxDescription,
      labelColor,
      labelFontSize,
      labelFontWeight,
      checkboxSize,
      borderRadius,
      checkedBgColor,
      uncheckedBgColor,
      gapBetweenCheckboxLabel,
      checkmarkSize,
      checkmarkColor,
      descriptionColor,
      descriptionFontSize,
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
        <Text style={{ fontSize: 28, fontWeight: 600, color: theme.primaryText }}>Checkbox</Text>
      </div>

      <VerticalSpace space="large" />
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Kolom 1: Style Statis */}
        <div style={{ maxHeight: "calc(100vh - 120px)", paddingTop: 12, overflowY: "auto", flex: 1, minWidth: 260, paddingRight: 16 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, color: theme.primaryText }}>Style Statis :</Text>
          <VerticalSpace space="large" />

          <InputField label="Label Checkbox :" value={checkboxLabel} onChange={setCheckboxLabel} placeholder="Contoh: Offers" />

          <ColorPicker label="Warna label :" value={labelColor} onChange={setLabelColor} />
          <InputField label="Ukuran font label (px) :" value={labelFontSize} onChange={setLabelFontSize} placeholder="Contoh: 14" />
          <InputField label="Font weight label :" value={labelFontWeight} onChange={setLabelFontWeight} placeholder="Contoh: 500 (akan menjadi font-[500])" />

          <InputField label="Deskripsi Checkbox :" value={checkboxDescription} onChange={setCheckboxDescription} placeholder="Contoh: Get notified when a candidate accepts or rejects an offer." />

          <ColorPicker label="Warna deskripsi :" value={descriptionColor} onChange={setDescriptionColor} />
          <InputField label="Ukuran font deskripsi (px) :" value={descriptionFontSize} onChange={setDescriptionFontSize} placeholder="Contoh: 14" />

          <InputField label="Ukuran checkbox (px) :" value={checkboxSize} onChange={setCheckboxSize} placeholder="Contoh: 20" />
          <InputField label="Border radius (px) :" value={borderRadius} onChange={setBorderRadius} placeholder="Contoh: 4" />
          <ColorPicker label="Background (unchecked) :" value={uncheckedBgColor} onChange={setUncheckedBgColor} />
          <ColorPicker label="Background (checked) :" value={checkedBgColor} onChange={setCheckedBgColor} />
          <InputField label="Padding checkbox-label (px) :" value={gapBetweenCheckboxLabel} onChange={setGapBetweenCheckboxLabel} placeholder="Contoh: 8" />
          <InputField label="Ukuran checkmark (px) :" value={checkmarkSize} onChange={setCheckmarkSize} placeholder="Contoh: 14 (akan menjadi h-[14px] w-[14px])" />
          <ColorPicker label="Warna checkmark :" value={checkmarkColor} onChange={setCheckmarkColor} />
        </div>

        {/* Kolom 2: Live Preview & Kode */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 400, display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
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
            {/* Single Checkbox Preview dengan Label dan Deskripsi */}
            {(() => {
              const label = checkboxLabel || "Checkbox";
              const description = checkboxDescription || "";

              // Initialize checked state if needed
              if (checkedStates.length === 0) {
                setCheckedStates([true]);
              }

              const isChecked = checkedStates[0] ?? true;

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", width: "100%" }}>
                    <label style={{ display: "flex", alignItems: "center", cursor: "pointer", position: "relative" }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => {
                          setCheckedStates([e.currentTarget.checked]);
                        }}
                        style={{
                          width: `${checkboxSize.replace(/px/gi, "") || 20}px`,
                          height: `${checkboxSize.replace(/px/gi, "") || 20}px`,
                          borderRadius: `${borderRadius.replace(/px/gi, "") || 4}px`,
                          background: isChecked ? checkedBgColor : uncheckedBgColor,
                          cursor: "pointer",
                          appearance: "none",
                          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          color: checkmarkColor,
                          opacity: isChecked ? 1 : 0,
                          pointerEvents: "none",
                          transition: "opacity 0.2s",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            width: `${checkmarkSize.replace(/px/gi, "") || 14}px`,
                            height: `${checkmarkSize.replace(/px/gi, "") || 14}px`,
                          }}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1"
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </label>
                    <div style={{ marginLeft: `${gapBetweenCheckboxLabel}px`, flex: 1 }}>
                      <span style={{ color: labelColor, fontSize: `${labelFontSize}px`, fontWeight: Number(labelFontWeight) || 500, display: "block" }}>{label}</span>
                    </div>
                  </div>
                  {description && (
                    <div style={{ marginLeft: `${(Number(checkboxSize.replace(/px/gi, "")) || 20) + (Number(gapBetweenCheckboxLabel) || 0)}px` }}>
                      <p style={{ color: descriptionColor, fontSize: `${descriptionFontSize}px`, marginTop: 0, marginBottom: 0 }}>{description}</p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          <VerticalSpace space="large" />
          <div style={{ display: "flex", gap: 12 }}>
            <Button fullWidth danger onClick={onBack}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <IconClose16 />
                Tutup
              </span>
            </Button>
            <Button fullWidth onClick={handleCreateCheckbox}>
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
