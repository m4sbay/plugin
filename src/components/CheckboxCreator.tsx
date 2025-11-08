import { Button, Dropdown, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useState, useCallback, useEffect } from "preact/hooks";
import { InputField } from "./ui/InputField";
import { ColorPicker } from "./ui/ColorPicker";

export function CheckboxCreator({ onBack }: { onBack: () => void }) {
  // State Style Statis
  const [headingLabel, setHeadingLabel] = useState("Checkbox");
  const [headingFontSize, setHeadingFontSize] = useState("16");
  const [headingColor, setHeadingColor] = useState("#111827");
  const [checkboxLabel, setCheckboxLabel] = useState("Accept Terms");
  const [checkboxCount, setCheckboxCount] = useState("1");
  const [labelColor, setLabelColor] = useState("#222222");
  const [labelFontSize, setLabelFontSize] = useState("14");
  const [checkboxSize, setCheckboxSize] = useState("20");
  const [borderWidth, setBorderWidth] = useState("2");
  const [borderRadius, setBorderRadius] = useState("4");
  const [borderColor, setBorderColor] = useState("#D1D5DB");
  const [checkedBgColor, setCheckedBgColor] = useState("#3B82F6");
  const [checkedBorderColor, setCheckedBorderColor] = useState("#3B82F6");
  const [uncheckedBgColor, setUncheckedBgColor] = useState("#FFFFFF");
  const [gapBetweenCheckboxLabel, setGapBetweenCheckboxLabel] = useState("8");

  // State Style Dinamis
  const [hoverBorderColor, setHoverBorderColor] = useState("#3B82F6");
  const [hoverBgColor, setHoverBgColor] = useState("#EFF6FF");
  const [focusRingWidth, setFocusRingWidth] = useState("2");
  const [focusRingColor, setFocusRingColor] = useState("#3B82F6");

  // Transisi
  const [transitionType, setTransitionType] = useState("normal");
  const transitionOptions = [
    { value: "none", text: "Tanpa Transisi" },
    { value: "fast", text: "Cepat (150ms)" },
    { value: "normal", text: "Normal (300ms)" },
    { value: "slow", text: "Lambat (500ms)" },
  ];

  const [htmltailwind, setHtmltailwind] = useState("");

  // Generate Tailwind code
  const generateCode = useCallback(() => {
    const transitionClass = transitionType !== "none" ? ` transition-all duration-[${transitionType === "fast" ? 150 : transitionType === "slow" ? 500 : 300}ms]` : "";

    // Classes untuk checkbox
    const checkboxClasses = `
    appearance-none
    w-[${checkboxSize}px] h-[${checkboxSize}px] 
    border-[${borderWidth}px] 
    rounded-[${borderRadius}px] 
    border-[${borderColor}]
    bg-[${uncheckedBgColor}]
    checked:bg-[${checkedBgColor}] 
    checked:border-[${checkedBorderColor}]
    hover:border-[${hoverBorderColor}] 
    hover:bg-[${hoverBgColor}]
    focus:outline-none
    focus:ring-[${focusRingWidth}px] 
    focus:ring-[${focusRingColor}]
    focus:ring-offset-0
    cursor-pointer
    ${transitionClass}
  `
      .trim()
      .replace(/\s+/g, " ");

    const headingStyle = `color:${headingColor};font-size:${headingFontSize}px;display:block;margin-bottom:12px;font-weight:500;`;

    const count = parseInt(checkboxCount) || 1;
    const checkboxItems = Array.from(
      { length: count },
      (_, i) =>
        `  <label class="flex items-center gap-[${gapBetweenCheckboxLabel}px] cursor-pointer mb-2">
    <input type="checkbox" class="${checkboxClasses}" />
    <span style="color:${labelColor};font-size:${labelFontSize}px;">${checkboxLabel} ${count > 1 ? i + 1 : ""}</span>
  </label>`
    ).join("\n");

    const html = `<div class="checkbox-wrapper">
  <label style="${headingStyle}">${headingLabel}</label>
${checkboxItems}
</div>`;

    setHtmltailwind(html);
    return html;
  }, [
    headingLabel,
    headingFontSize,
    headingColor,
    checkboxLabel,
    checkboxCount,
    labelColor,
    labelFontSize,
    checkboxSize,
    borderWidth,
    borderRadius,
    borderColor,
    checkedBgColor,
    checkedBorderColor,
    uncheckedBgColor,
    gapBetweenCheckboxLabel,
    hoverBorderColor,
    hoverBgColor,
    focusRingWidth,
    focusRingColor,
    transitionType,
  ]);

  useEffect(() => {
    generateCode();
  }, [generateCode]);

  // Emit ke Figma
  const handleCreateCheckbox = () => {
    emit("CREATE_CHECKBOX", {
      headingLabel,
      headingFontSize,
      headingColor,
      checkboxLabel,
      checkboxCount,
      labelColor,
      labelFontSize,
      checkboxSize,
      borderWidth,
      borderRadius,
      borderColor,
      checkedBgColor,
      checkedBorderColor,
      uncheckedBgColor,
      gapBetweenCheckboxLabel,
      hoverBorderColor,
      hoverBgColor,
      focusRingWidth,
      focusRingColor,
      transitionType,
      htmltailwind,
    });
  };

  return (
    <div style={{ padding: "32px 24px 24px 24px", fontFamily: "Inter, system-ui, sans-serif", background: "#fff", minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", marginRight: 8, padding: 0, display: "flex", alignItems: "center" }}>
          <svg width="15" height="20" viewBox="0 0 20 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.57426 13.7604C1.58095 13.5264 1.62774 13.3125 1.71464 13.1187C1.80155 12.9248 1.93524 12.7376 2.11573 12.5571L12.1629 2.8308C12.4504 2.54335 12.8047 2.39963 13.2258 2.39963C13.5066 2.39963 13.7606 2.46648 13.9879 2.60017C14.2218 2.73387 14.4057 2.91436 14.5394 3.14164C14.6798 3.36892 14.7499 3.62294 14.7499 3.9037C14.7499 4.31816 14.5929 4.68248 14.2787 4.99666L5.19407 13.7504L14.2787 22.5141C14.5929 22.835 14.7499 23.1993 14.7499 23.6071C14.7499 23.8945 14.6798 24.1519 14.5394 24.3792C14.4057 24.6064 14.2218 24.7869 13.9879 24.9206C13.7606 25.061 13.5066 25.1312 13.2258 25.1312C12.8047 25.1312 12.4504 24.9841 12.1629 24.69L2.11573 14.9637C1.92856 14.7832 1.79152 14.596 1.70462 14.4021C1.61771 14.2016 1.57426 13.9877 1.57426 13.7604Z"
              fill="#007AFF"
            />
          </svg>
        </button>
        <Text style={{ fontSize: 28, fontWeight: 600, color: "#222" }}>Checkbox</Text>
      </div>

      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Kolom 1: Style Statis */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Style Statis :</Text>
          <VerticalSpace space="small" />

          <Text style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, marginTop: 12 }}>Konten :</Text>
          <InputField label="Heading Checkbox :" value={headingLabel} onChange={setHeadingLabel} placeholder="Contoh: Checkbox" />
          <InputField label="Ukuran font heading (px) :" value={headingFontSize} onChange={setHeadingFontSize} placeholder="Contoh: 16" />
          <ColorPicker label="Warna heading :" value={headingColor} onChange={setHeadingColor} />
          <InputField label="Label Checkbox :" value={checkboxLabel} onChange={setCheckboxLabel} placeholder="Contoh: Accept Terms" />
          <InputField label="Jumlah Checkbox :" value={checkboxCount} onChange={setCheckboxCount} placeholder="Contoh: 1" />
          <ColorPicker label="Warna label :" value={labelColor} onChange={setLabelColor} />
          <InputField label="Ukuran font label (px) :" value={labelFontSize} onChange={setLabelFontSize} placeholder="Contoh: 14" />

          <Text style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, marginTop: 12 }}>Checkbox :</Text>
          <InputField label="Ukuran checkbox (px) :" value={checkboxSize} onChange={setCheckboxSize} placeholder="Contoh: 20" />
          <InputField label="Lebar border (px) :" value={borderWidth} onChange={setBorderWidth} placeholder="Contoh: 2" />
          <InputField label="Border radius (px) :" value={borderRadius} onChange={setBorderRadius} placeholder="Contoh: 4" />
          <ColorPicker label="Warna border (unchecked) :" value={borderColor} onChange={setBorderColor} />
          <ColorPicker label="Background (unchecked) :" value={uncheckedBgColor} onChange={setUncheckedBgColor} />
          <ColorPicker label="Background (checked) :" value={checkedBgColor} onChange={setCheckedBgColor} />
          <ColorPicker label="Border (checked) :" value={checkedBorderColor} onChange={setCheckedBorderColor} />
          <InputField label="Jarak checkbox-label (px) :" value={gapBetweenCheckboxLabel} onChange={setGapBetweenCheckboxLabel} placeholder="Contoh: 8" />
        </div>

        {/* Kolom 2: Style Dinamis */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Style Dinamis :</Text>
          <VerticalSpace space="small" />

          <Text style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, marginTop: 12 }}>Hover State :</Text>
          <ColorPicker label="Border saat hover :" value={hoverBorderColor} onChange={setHoverBorderColor} />
          <ColorPicker label="Background saat hover :" value={hoverBgColor} onChange={setHoverBgColor} />

          <Text style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, marginTop: 12 }}>Focus State :</Text>
          <InputField label="Lebar ring focus (px) :" value={focusRingWidth} onChange={setFocusRingWidth} placeholder="Contoh: 2" />
          <ColorPicker label="Warna ring focus :" value={focusRingColor} onChange={setFocusRingColor} />

          <Text style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, marginTop: 12 }}>Transisi :</Text>
          <Dropdown options={transitionOptions} value={transitionType} onValueChange={setTransitionType} />
        </div>

        {/* Kolom 3: Live Preview & Kode */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 400, position: "sticky", top: 24, alignSelf: "flex-start", zIndex: 2 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Live Preview :</Text>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, background: "#f8f9fa", minHeight: 120, marginBottom: 24, padding: 24 }}>
            {/* Heading Checkbox */}
            <Text style={{ display: "block", marginBottom: 12, color: headingColor, fontSize: `${headingFontSize}px`, fontWeight: 500 }}>{headingLabel}</Text>

            {/* Multiple Checkboxes */}
            {Array.from({ length: parseInt(checkboxCount) || 1 }, (_, i) => (
              <label key={i} style={{ display: "flex", alignItems: "center", gap: `${gapBetweenCheckboxLabel}px`, cursor: "pointer", marginBottom: 8 }}>
                <input
                  type="checkbox"
                  style={{
                    width: `${checkboxSize}px`,
                    height: `${checkboxSize}px`,
                    border: `${borderWidth}px solid ${borderColor}`,
                    borderRadius: `${borderRadius}px`,
                    background: uncheckedBgColor,
                    cursor: "pointer",
                    accentColor: checkedBgColor,
                  }}
                />
                <span style={{ color: labelColor, fontSize: `${labelFontSize}px` }}>
                  {checkboxLabel} {parseInt(checkboxCount) > 1 ? i + 1 : ""}
                </span>
              </label>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Button fullWidth secondary onClick={onBack}>
              Tutup
            </Button>
            <Button fullWidth onClick={handleCreateCheckbox}>
              Buat
            </Button>
          </div>

          <Text style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Kode :</Text>
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "#f8f9fa",
              minHeight: 120,
              padding: 16,
              fontFamily: "monospace",
              fontSize: 12,
              color: "#222",
              wordBreak: "break-all",
              position: "relative",
              maxHeight: 300,
              overflowY: "auto",
            }}
          >
            <Textbox value={htmltailwind} onValueInput={() => {}} style={{ background: "transparent", border: "none", width: "100%", minHeight: 100 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
