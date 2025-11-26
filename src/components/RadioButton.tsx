import { Button, Dropdown, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useState, useCallback, useEffect } from "preact/hooks";
import { InputField } from "./ui/InputField";
import { ColorPicker } from "./ui/ColorPicker";
import { SelectionChangeHandler } from "../types/types";

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
  const [headingLabel, setHeadingLabel] = useState("Radio Button");
  const [headingFontSize, setHeadingFontSize] = useState("18");
  const [headingColor, setHeadingColor] = useState("#00BCFF");
  const [radioLabels, setRadioLabels] = useState("Default option,Comfortable option,Compact option");
  const [radioCount, setRadioCount] = useState("3");
  const [labelColor, setLabelColor] = useState("#00BCFF");
  const [labelFontSize, setLabelFontSize] = useState("14");
  const [checkedColor, setCheckedColor] = useState("#4F46E5");
  const [layoutDirection, setLayoutDirection] = useState("vertical");

  // State Style Dinamis
  const [hoverBorderColor, setHoverBorderColor] = useState("#4F46E5");
  const [hoverBgColor, setHoverBgColor] = useState("#EEF2FF");

  // Transisi
  const [transitionType, setTransitionType] = useState("normal");
  const transitionOptions = [
    { value: "none", text: "Tanpa Transisi" },
    { value: "fast", text: "Cepat (150ms)" },
    { value: "normal", text: "Normal (300ms)" },
    { value: "slow", text: "Lambat (500ms)" },
  ];

  // Layout options
  const layoutOptions = [
    { value: "vertical", text: "Menurun" },
    { value: "horizontal", text: "Mendatar" },
  ];

  const [htmltailwind, setHtmltailwind] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate Tailwind code
  const generateCode = useCallback(() => {
    const transitionClass = transitionType !== "none" ? ` transition-all duration-[${transitionType === "fast" ? 150 : transitionType === "slow" ? 500 : 300}ms]` : "";

    // Classes untuk radio button (default size: w-4 h-4 = 16px, gap: space-x-2 = 8px)
    // Menggunakan appearance-none untuk menghilangkan styling default browser
    const radioClasses = `
      appearance-none
      w-4 h-4
      rounded-full
      border border-gray-300
      bg-white
      checked:border-[${checkedColor}]
      hover:border-[${hoverBorderColor}]
      hover:bg-[${hoverBgColor}]
      focus:outline-none
      cursor-pointer
      ${transitionClass}
    `
      .trim()
      .replace(/\s+/g, " ");

    const headingStyle = `text-[${headingFontSize}px] font-semibold mb-4`;
    const headingInlineStyle = `color:${headingColor};font-size:${headingFontSize}px;font-weight:600;`;

    const count = parseInt(radioCount) || 1;
    const labels = radioLabels
      .split(",")
      .map(l => l.trim())
      .slice(0, count);

    // Layout container class untuk form
    const layoutClass = layoutDirection === "horizontal" ? "flex flex-row space-x-3" : "space-y-3";

    // CSS untuk custom radio button dengan inner circle saat checked
    const customRadioCSS = `
      input[type="radio"] {
        position: relative;
      }
      input[type="radio"]:checked {
        background-color: ${checkedColor};
        border-color: ${checkedColor};
      }
      input[type="radio"]:checked::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: white;
      }
    `;

    const radioItems = labels
      .map(
        (label, i) =>
          `        <label class="flex items-center space-x-2 cursor-pointer">
          <input type="radio" name="radio-option" value="option-${i + 1}" class="${radioClasses}" ${i === 0 ? "checked" : ""} />
          <span style="color:${labelColor};font-size:${labelFontSize}px;">${label}</span>
        </label>`
      )
      .join("\n");

    const html = `
    <div>
    <!-- Radio Button -->
  <style>
    ${customRadioCSS}
  </style>
  <h2 class="${headingStyle}" style="${headingInlineStyle}">${headingLabel}</h2>
  <form class="${layoutClass}">
${radioItems}
  </form>
  </div>`;

    setHtmltailwind(html);
    return html;
  }, [headingLabel, headingFontSize, headingColor, radioLabels, radioCount, labelColor, labelFontSize, checkedColor, layoutDirection, hoverBorderColor, hoverBgColor, transitionType]);

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
          if (parsed.headingFontSize !== undefined) setHeadingFontSize(parsed.headingFontSize || "18");
          if (parsed.headingColor !== undefined) setHeadingColor(parsed.headingColor || "#00BCFF");
          if (parsed.radioLabels !== undefined) setRadioLabels(parsed.radioLabels || "");
          if (parsed.radioCount !== undefined) setRadioCount(parsed.radioCount || "1");
          if (parsed.labelColor !== undefined) setLabelColor(parsed.labelColor || "#00BCFF");
          if (parsed.labelFontSize !== undefined) setLabelFontSize(parsed.labelFontSize || "14");
          if (parsed.checkedColor !== undefined) setCheckedColor(parsed.checkedColor || "#4F46E5");
          if (parsed.layoutDirection !== undefined) setLayoutDirection(parsed.layoutDirection || "vertical");
          if (parsed.hoverBorderColor !== undefined) setHoverBorderColor(parsed.hoverBorderColor || "#4F46E5");
          if (parsed.hoverBgColor !== undefined) setHoverBgColor(parsed.hoverBgColor || "#EEF2FF");
          if (parsed.transitionType !== undefined) setTransitionType(parsed.transitionType || "normal");
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
  const handleCreateRadioButton = () => {
    emit("CREATE_RADIO_BUTTON", {
      headingLabel,
      headingFontSize,
      headingColor,
      radioLabels,
      radioCount,
      labelColor,
      labelFontSize,
      checkedColor,
      layoutDirection,
      hoverBorderColor,
      hoverBgColor,
      transitionType,
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
          <InputField label="Heading Radio Button :" value={headingLabel} onChange={setHeadingLabel} placeholder="Contoh: Radio Button" />
          <InputField label="Ukuran font heading (px) :" value={headingFontSize} onChange={setHeadingFontSize} placeholder="Contoh: 18" />
          <ColorPicker label="Warna heading :" value={headingColor} onChange={setHeadingColor} />
          <InputField label="Jumlah Radio :" value={radioCount} onChange={setRadioCount} placeholder="Contoh: 3" />
          <InputField label="Label Radio (pisahkan dengan koma) :" value={radioLabels} onChange={setRadioLabels} placeholder="Contoh: Default option,Comfortable option,Compact option" />

          <ColorPicker label="Warna label :" value={labelColor} onChange={setLabelColor} />
          <InputField label="Ukuran font label (px) :" value={labelFontSize} onChange={setLabelFontSize} placeholder="Contoh: 14" />
          <ColorPicker label="Warna checked :" value={checkedColor} onChange={setCheckedColor} />

          <Text style={{ fontWeight: 400, fontSize: 11, marginBottom: 10, color: theme.secondaryText }}>Layout :</Text>
          <Dropdown options={layoutOptions} value={layoutDirection} onValueChange={setLayoutDirection} />
        </div>

        {/* Kolom 2: Style Dinamis */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, color: theme.primaryText }}>Style Dinamis :</Text>
          <VerticalSpace space="small" />
          <ColorPicker label="Border saat hover :" value={hoverBorderColor} onChange={setHoverBorderColor} />
          <ColorPicker label="Background saat hover :" value={hoverBgColor} onChange={setHoverBgColor} />

          <Text style={{ fontWeight: 400, fontSize: 11, marginBottom: 8, color: theme.secondaryText }}>Tipe transisi :</Text>
          <Dropdown options={transitionOptions} value={transitionType} onValueChange={setTransitionType} />
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
            {/* CSS untuk styling radio button di preview */}
            <style>
              {`
                .radio-preview input[type="radio"] {
                  appearance: none;
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  border: 1px solid #d1d5db;
                  background-color: white;
                  position: relative;
                  cursor: pointer;
                  transition: all ${transitionType === "none" ? "0ms" : transitionType === "fast" ? "150ms" : transitionType === "slow" ? "500ms" : "300ms"};
                }
                .radio-preview input[type="radio"]:checked {
                  background-color: ${checkedColor};
                  border-color: ${checkedColor};
                }
                .radio-preview input[type="radio"]:checked::after {
                  content: "";
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  background-color: white;
                }
                .radio-preview input[type="radio"]:hover {
                  border-color: ${hoverBorderColor};
                  background-color: ${hoverBgColor};
                }
                .radio-preview input[type="radio"]:focus {
                  outline: none;
                }
              `}
            </style>
            {/* Heading Radio Button */}
            <Text style={{ display: "block", marginBottom: 16, color: headingColor, fontSize: `${headingFontSize}px`, fontWeight: 600 }}>{headingLabel}</Text>

            {/* Multiple Radio Buttons */}
            <form
              className="radio-preview"
              style={{ display: layoutDirection === "horizontal" ? "flex" : "block", flexDirection: layoutDirection === "horizontal" ? "row" : "column", gap: layoutDirection === "horizontal" ? "12px" : "12px" }}
            >
              {labels.map((label, i) => (
                <label key={i} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: layoutDirection === "vertical" ? "12px" : "0" }}>
                  <input type="radio" name="radio-preview" defaultChecked={i === 0} />
                  <span style={{ color: labelColor, fontSize: `${labelFontSize}px` }}>{label}</span>
                </label>
              ))}
            </form>
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
              minHeight: 120,
              padding: 16,
              fontFamily: "monospace",
              fontSize: 12,
              color: theme.codeText,
              wordBreak: "break-all",
              position: "relative",
              maxHeight: 300,
              overflowY: "auto",
            }}
          >
            <Textbox value={htmltailwind} onValueInput={() => {}} style={{ background: "transparent", border: "none", width: "100%", minHeight: 100, color: theme.codeText }} />
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
