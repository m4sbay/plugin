import { Button, Dropdown, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useState, useCallback, useEffect } from "preact/hooks";
import { InputField } from "./ui/InputField";
import { ColorPicker } from "./ui/ColorPicker";
import { SelectionChangeHandler } from "../types/types";

type SwitchCreatorProps = {
  onBack: () => void;
  isDark?: boolean;
};

export function SwitchCreator({ onBack, isDark = false }: SwitchCreatorProps) {
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
  // State Style Statis
  const [headlineText, setHeadlineText] = useState("Switch");
  const [headlineColor, setHeadlineColor] = useState("#00BCFF"); // gray-900
  const [headlineFontSize, setHeadlineFontSize] = useState("18");
  const [switchCount, setSwitchCount] = useState("1");
  const [switchLabels, setSwitchLabels] = useState("Airplane Mode");
  const [containerWidth, setContainerWidth] = useState("100%"); // Lebar container/card
  const [labelColor, setLabelColor] = useState("#00BCFF"); // slate-700
  const [labelFontSize, setLabelFontSize] = useState("14");
  const [switchWidth, setSwitchWidth] = useState("44"); // w-11 = 44px
  const [switchHeight, setSwitchHeight] = useState("24"); // h-6 = 24px
  const [toggleSize, setToggleSize] = useState("20"); // h-5 w-5 = 20px
  const [borderRadius, setBorderRadius] = useState("9999"); // rounded-full
  const [uncheckedBorderColor, setUncheckedBorderColor] = useState("#CBD5E1"); // slate-300
  const [uncheckedBgColor, setUncheckedBgColor] = useState("#E2E8F0"); // slate-200
  const [checkedBorderColor, setCheckedBorderColor] = useState("#2563EB"); // blue-600
  const [checkedBgColor, setCheckedBgColor] = useState("#2563EB"); // blue-600
  const [toggleBgColor, setToggleBgColor] = useState("#FFFFFF"); // white
  const [defaultCheckedStates, setDefaultCheckedStates] = useState("false"); // comma-separated: "false,true,false"
  const [disabledStates, setDisabledStates] = useState("false"); // comma-separated: "false,false,false,true"

  // State Style Dinamis
  const [focusRingWidth, setFocusRingWidth] = useState("2");
  const [focusRingColor, setFocusRingColor] = useState("#3B82F6"); // blue-500

  // Transisi
  const [transitionType, setTransitionType] = useState("normal");
  const transitionOptions = [
    { value: "none", text: "Tanpa Transisi" },
    { value: "fast", text: "Cepat (150ms)" },
    { value: "normal", text: "Normal (300ms)" },
    { value: "slow", text: "Lambat (500ms)" },
  ];

  const [htmltailwind, setHtmltailwind] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate Tailwind code
  const generateCode = useCallback(() => {
    const transitionClass = transitionType !== "none" ? ` transition-all duration-[${transitionType === "fast" ? 150 : transitionType === "slow" ? 500 : 300}ms]` : "";

    const count = parseInt(switchCount) || 1;
    const labels = switchLabels.split(",").map(l => l.trim());
    const checkedStates = defaultCheckedStates.split(",").map(c => c.trim() === "true");
    const disabledStatesArray = disabledStates.split(",").map(d => d.trim() === "true");

    const switchItems = Array.from({ length: count }, (_, i) => {
      const label = labels[i] || `Switch ${i + 1}`;
      const isChecked = checkedStates[i] || false;
      const isDisabled = disabledStatesArray[i] || false;
      const switchId = `switch-${i + 1}`;

      if (isDisabled) {
        return `  <div class="flex items-center justify-between py-2 opacity-50">
    <label for="${switchId}" class="text-sm font-medium text-slate-700" style="flex-shrink:0;max-width:fit-content;">${label}</label>
    <label class="relative inline-flex h-[${switchHeight}px] w-[${switchWidth}px] cursor-not-allowed items-center flex-shrink-0">
      <input id="${switchId}" type="checkbox" class="peer sr-only" disabled />
      <span class="absolute inset-0 rounded-full border border-[${uncheckedBorderColor}] bg-[${uncheckedBgColor}]"></span>
      <span class="pointer-events-none absolute top-0.5 left-0.5 h-[${toggleSize}px] w-[${toggleSize}px] rounded-full bg-[${toggleBgColor}] shadow"></span>
    </label>
  </div>`;
      }

      return `  <div class="flex items-center justify-between py-2">
    <label for="${switchId}" class="text-sm font-medium" style="color:${labelColor};font-size:${labelFontSize}px;flex-shrink:0;max-width:fit-content;">${label}</label>
    <label class="relative inline-flex h-[${switchHeight}px] w-[${switchWidth}px] cursor-pointer items-center flex-shrink-0">
      <input id="${switchId}" type="checkbox" class="peer sr-only" ${isChecked ? "checked" : ""} />
      <span
        class="absolute inset-0 rounded-full border border-[${uncheckedBorderColor}] bg-[${uncheckedBgColor}]${transitionClass} peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[${focusRingColor}] peer-checked:bg-[${checkedBgColor}] peer-checked:border-[${checkedBorderColor}]"
      ></span>
      <span class="pointer-events-none absolute top-0.5 left-0.5 h-[${toggleSize}px] w-[${toggleSize}px] rounded-full bg-[${toggleBgColor}] shadow${transitionClass} peer-checked:translate-x-[${
        parseInt(switchWidth) - parseInt(toggleSize) - 2
      }px]"></span>
    </label>
  </div>`;
    }).join("\n");

    const containerWidthClass = containerWidth === "100%" ? "w-full" : "";
    const containerWidthStyle = containerWidth && containerWidth !== "100%" ? `width:${containerWidth}px;` : "";
    const headlineStyle = `color:${headlineColor};font-size:${headlineFontSize}px;`;
    const html = `<section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm${containerWidthClass ? ` ${containerWidthClass}` : ""}"${containerWidthStyle ? ` style="${containerWidthStyle}"` : ""}>
  <h2 class="mb-4 font-semibold" style="${headlineStyle}">${headlineText}</h2>

${switchItems}
</section>`;

    setHtmltailwind(html);
    return html;
  }, [
    switchCount,
    switchLabels,
    containerWidth,
    headlineText,
    headlineColor,
    headlineFontSize,
    labelColor,
    labelFontSize,
    switchWidth,
    switchHeight,
    toggleSize,
    borderRadius,
    uncheckedBorderColor,
    uncheckedBgColor,
    checkedBorderColor,
    checkedBgColor,
    toggleBgColor,
    defaultCheckedStates,
    disabledStates,
    focusRingWidth,
    focusRingColor,
    transitionType,
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
        if (parsed?.componentType === "switch") {
          if (parsed.switchCount !== undefined) setSwitchCount(parsed.switchCount || "1");
          if (parsed.switchLabels !== undefined) setSwitchLabels(parsed.switchLabels || "Airplane Mode");
          if (parsed.containerWidth !== undefined) setContainerWidth(parsed.containerWidth || "");
          if (parsed.headlineText !== undefined) setHeadlineText(parsed.headlineText || "Switch");
          if (parsed.headlineColor !== undefined) setHeadlineColor(parsed.headlineColor || "#00BCFF");
          if (parsed.headlineFontSize !== undefined) setHeadlineFontSize(parsed.headlineFontSize || "18");
          if (parsed.labelColor !== undefined) setLabelColor(parsed.labelColor || "#00BCFF");
          if (parsed.labelFontSize !== undefined) setLabelFontSize(parsed.labelFontSize || "14");
          if (parsed.switchWidth !== undefined) setSwitchWidth(parsed.switchWidth || "44");
          if (parsed.switchHeight !== undefined) setSwitchHeight(parsed.switchHeight || "24");
          if (parsed.toggleSize !== undefined) setToggleSize(parsed.toggleSize || "20");
          if (parsed.borderRadius !== undefined) setBorderRadius(parsed.borderRadius || "9999");
          if (parsed.uncheckedBorderColor !== undefined) setUncheckedBorderColor(parsed.uncheckedBorderColor || "#CBD5E1");
          if (parsed.uncheckedBgColor !== undefined) setUncheckedBgColor(parsed.uncheckedBgColor || "#E2E8F0");
          if (parsed.checkedBorderColor !== undefined) setCheckedBorderColor(parsed.checkedBorderColor || "#2563EB");
          if (parsed.checkedBgColor !== undefined) setCheckedBgColor(parsed.checkedBgColor || "#2563EB");
          if (parsed.toggleBgColor !== undefined) setToggleBgColor(parsed.toggleBgColor || "#FFFFFF");
          if (parsed.defaultCheckedStates !== undefined) setDefaultCheckedStates(parsed.defaultCheckedStates || "false");
          if (parsed.disabledStates !== undefined) setDisabledStates(parsed.disabledStates || "false");
          if (parsed.focusRingWidth !== undefined) setFocusRingWidth(parsed.focusRingWidth || "2");
          if (parsed.focusRingColor !== undefined) setFocusRingColor(parsed.focusRingColor || "#3B82F6");
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
  const handleCreateSwitch = () => {
    emit("CREATE_SWITCH", {
      switchCount,
      switchLabels,
      containerWidth,
      headlineText,
      headlineColor,
      headlineFontSize,
      labelColor,
      labelFontSize,
      switchWidth,
      switchHeight,
      toggleSize,
      borderRadius,
      uncheckedBorderColor,
      uncheckedBgColor,
      checkedBorderColor,
      checkedBgColor,
      toggleBgColor,
      defaultCheckedStates,
      disabledStates,
      focusRingWidth,
      focusRingColor,
      transitionType,
      htmltailwind,
    });
  };

  const count = parseInt(switchCount) || 1;
  const labels = switchLabels.split(",").map(l => l.trim());
  const checkedStates = defaultCheckedStates.split(",").map(c => c.trim() === "true");
  const disabledStatesArray = disabledStates.split(",").map(d => d.trim() === "true");

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
        <Text style={{ fontSize: 28, fontWeight: 600, color: theme.primaryText }}>Switch</Text>
      </div>

      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Kolom 1: Style Statis */}
        <div style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto", flex: 1, minWidth: 260 }}>
          <VerticalSpace space="small" />
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, color: theme.primaryText }}>Style Statis :</Text>
          <VerticalSpace space="small" />
          <InputField label="Lebar container (px) :" value={containerWidth} onChange={setContainerWidth} placeholder="Contoh: 400 (tidak boleh kosong)" />
          <Text style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, marginTop: 12, color: theme.primaryText }}>Konten :</Text>
          <InputField label="Headline/Judul :" value={headlineText} onChange={setHeadlineText} placeholder="Contoh: Switch" />
          <ColorPicker label="Warna headline :" value={headlineColor} onChange={setHeadlineColor} />
          <InputField label="Ukuran font headline (px) :" value={headlineFontSize} onChange={setHeadlineFontSize} placeholder="Contoh: 18" />
          <InputField label="Jumlah Switch :" value={switchCount} onChange={setSwitchCount} placeholder="Contoh: 3" />
          <InputField label="Label Switch (pisahkan dengan koma) :" value={switchLabels} onChange={setSwitchLabels} placeholder="Contoh: Airplane Mode,Wi-Fi,Bluetooth" />
          <InputField label="Default Checked (pisahkan dengan koma, true/false) :" value={defaultCheckedStates} onChange={setDefaultCheckedStates} placeholder="Contoh: false,true,true" />
          <InputField label="Disabled (pisahkan dengan koma, true/false) :" value={disabledStates} onChange={setDisabledStates} placeholder="Contoh: false,false,false,true" />
          <ColorPicker label="Warna label :" value={labelColor} onChange={setLabelColor} />
          <InputField label="Ukuran font label (px) :" value={labelFontSize} onChange={setLabelFontSize} placeholder="Contoh: 14" />

          <Text style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, marginTop: 12, color: theme.primaryText }}>Container :</Text>

          <Text style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, marginTop: 12, color: theme.primaryText }}>Switch :</Text>
          <InputField label="Lebar switch (px) :" value={switchWidth} onChange={setSwitchWidth} placeholder="Contoh: 44" />
          <InputField label="Tinggi switch (px) :" value={switchHeight} onChange={setSwitchHeight} placeholder="Contoh: 24" />
          <InputField label="Ukuran toggle circle (px) :" value={toggleSize} onChange={setToggleSize} placeholder="Contoh: 20" />
          <InputField label="Border radius (px) :" value={borderRadius} onChange={setBorderRadius} placeholder="Contoh: 9999 (rounded-full)" />

          <Text style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, marginTop: 12, color: theme.primaryText }}>Warna (Unchecked) :</Text>
          <ColorPicker label="Warna border (unchecked) :" value={uncheckedBorderColor} onChange={setUncheckedBorderColor} />
          <ColorPicker label="Background (unchecked) :" value={uncheckedBgColor} onChange={setUncheckedBgColor} />

          <Text style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, marginTop: 12, color: theme.primaryText }}>Warna (Checked) :</Text>
          <ColorPicker label="Warna border (checked) :" value={checkedBorderColor} onChange={setCheckedBorderColor} />
          <ColorPicker label="Background (checked) :" value={checkedBgColor} onChange={setCheckedBgColor} />
          <ColorPicker label="Warna toggle circle :" value={toggleBgColor} onChange={setToggleBgColor} />
        </div>

        {/* Kolom 2: Style Dinamis */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, color: theme.primaryText }}>Style Dinamis :</Text>
          <VerticalSpace space="small" />

          <Text style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, marginTop: 12, color: theme.primaryText }}>Focus State :</Text>
          <InputField label="Lebar ring focus (px) :" value={focusRingWidth} onChange={setFocusRingWidth} placeholder="Contoh: 2" />
          <ColorPicker label="Warna ring focus :" value={focusRingColor} onChange={setFocusRingColor} />

          <Text style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, marginTop: 12, color: theme.primaryText }}>Transisi :</Text>
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
              width: containerWidth === "100%" ? "100%" : containerWidth ? `${containerWidth}px` : "auto",
            }}
          >
            {/* Headline */}
            <h2 style={{ marginBottom: 16, fontSize: `${headlineFontSize}px`, color: headlineColor, fontWeight: 600 }}>{headlineText}</h2>
            {Array.from({ length: count }, (_, i) => {
              const label = labels[i] || `Switch ${i + 1}`;
              const isChecked = checkedStates[i] || false;
              const isDisabled = disabledStatesArray[i] || false;
              const translateX = parseInt(switchWidth) - parseInt(toggleSize) - 2;

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    opacity: isDisabled ? 0.5 : 1,
                  }}
                >
                  <label style={{ fontSize: `${labelFontSize}px`, color: labelColor, fontWeight: 500 }}>{label}</label>
                  <label
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      height: `${switchHeight}px`,
                      width: `${switchWidth}px`,
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      alignItems: "center",
                    }}
                  >
                    <input type="checkbox" checked={isChecked} disabled={isDisabled} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
                    <span
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: borderRadius === "9999" ? "9999px" : `${borderRadius}px`,
                        border: `1px solid ${isChecked ? checkedBorderColor : uncheckedBorderColor}`,
                        background: isChecked ? checkedBgColor : uncheckedBgColor,
                        transition: transitionType !== "none" ? `all ${transitionType === "fast" ? 150 : transitionType === "slow" ? 500 : 300}ms` : "none",
                      }}
                    />
                    <span
                      style={{
                        pointerEvents: "none",
                        position: "absolute",
                        top: "2px",
                        left: "2px",
                        height: `${toggleSize}px`,
                        width: `${toggleSize}px`,
                        borderRadius: "50%",
                        background: toggleBgColor,
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        transform: isChecked ? `translateX(${translateX}px)` : "translateX(0)",
                        transition: transitionType !== "none" ? `all ${transitionType === "fast" ? 150 : transitionType === "slow" ? 500 : 300}ms` : "none",
                      }}
                    />
                  </label>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Button fullWidth secondary onClick={onBack}>
              Tutup
            </Button>
            <Button fullWidth onClick={handleCreateSwitch}>
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
