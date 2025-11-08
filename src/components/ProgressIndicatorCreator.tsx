import { Button, Dropdown, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useState, useCallback, useEffect } from "preact/hooks";
import { InputField } from "./ui/InputField";
import { ColorPicker } from "./ui/ColorPicker";

export function ProgressIndicatorCreator({ onBack }: { onBack: () => void }) {
  // State untuk Progress Indicator
  const [progressValue, setProgressValue] = useState("60");
  const [progressType, setProgressType] = useState("bar");
  const [width, setWidth] = useState("300");
  const [height, setHeight] = useState("12");
  const [progressColor, setProgressColor] = useState("#3B82F6");
  const [bgColor, setBgColor] = useState("#E5E7EB");
  const [borderRadius, setBorderRadius] = useState("9999");
  const [showPercentage, setShowPercentage] = useState("yes");

  const progressTypeOptions = [
    { value: "bar", text: "Progress Bar" },
    { value: "circle", text: "Progress Circle" },
  ];

  const showPercentageOptions = [
    { value: "yes", text: "Ya" },
    { value: "no", text: "Tidak" },
  ];

  const [htmltailwind, setHtmltailwind] = useState("");

  // Generate Tailwind code
  const generateCode = useCallback(() => {
    let classes = "";
    if (progressType === "bar") {
      if (bgColor) classes += ` bg-[${bgColor}]`;
      if (borderRadius) classes += ` rounded-[${borderRadius}]`;
      if (width) classes += ` w-[${width}]`;
      if (height) classes += ` h-[${height}]`;
      
      const innerClasses = `bg-[${progressColor}] h-full rounded-[${borderRadius}] transition-all duration-300`;
      const percentage = showPercentage === "yes" ? `<span class="ml-2">${progressValue}%</span>` : "";
      const html = `<div class="flex items-center"><div class="progress-bar ${classes.trim()}">
  <div class="${innerClasses}" style="width:${progressValue}%"></div>
</div>${percentage}</div>`;
      setHtmltailwind(html);
    } else {
      // Circle progress
      const html = `<div class="progress-circle" style="width:${width}px;height:${width}px;">
  <svg viewBox="0 0 36 36">
    <circle cx="18" cy="18" r="16" fill="${bgColor}" />
    <circle cx="18" cy="18" r="16" fill="none" stroke="${progressColor}" stroke-width="2" 
      stroke-dasharray="${progressValue}, 100" transform="rotate(-90 18 18)" />
    ${showPercentage === "yes" ? `<text x="18" y="20.5" text-anchor="middle" font-size="8">${progressValue}%</text>` : ""}
  </svg>
</div>`;
      setHtmltailwind(html);
    }
    return htmltailwind;
  }, [progressValue, progressType, width, height, progressColor, bgColor, borderRadius, showPercentage, htmltailwind]);

  useEffect(() => {
    generateCode();
  }, [generateCode]);

  // Emit ke Figma
  const handleCreateProgressIndicator = () => {
    emit("CREATE_PROGRESS_INDICATOR", {
      progressValue,
      progressType,
      width,
      height,
      progressColor,
      bgColor,
      borderRadius,
      showPercentage,
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
        <Text style={{ fontSize: 28, fontWeight: 600, color: "#222" }}>Progress Indicator</Text>
      </div>
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Kolom 1: Style */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Pengaturan :</Text>
          <VerticalSpace space="small" />
          <InputField label="Nilai Progress (%) :" value={progressValue} onChange={setProgressValue} placeholder="Contoh: 60" />
          <Dropdown options={progressTypeOptions} value={progressType} onValueChange={setProgressType} />
          <InputField label="Lebar (px) :" value={width} onChange={setWidth} placeholder="Contoh: 300" />
          {progressType === "bar" && (
            <InputField label="Tinggi (px) :" value={height} onChange={setHeight} placeholder="Contoh: 12" />
          )}
          <ColorPicker label="Warna progress :" value={progressColor} onChange={setProgressColor} />
          <ColorPicker label="Warna latar :" value={bgColor} onChange={setBgColor} />
          {progressType === "bar" && (
            <InputField label="Border radius (px) :" value={borderRadius} onChange={setBorderRadius} placeholder="Contoh: 9999" />
          )}
          <Dropdown options={showPercentageOptions} value={showPercentage} onValueChange={setShowPercentage} />
        </div>
        
        {/* Kolom 2: Live Preview & Kode */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 500, position: "sticky", top: 24, alignSelf: "flex-start", zIndex: 2 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Live Preview :</Text>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, background: "#f8f9fa", minHeight: 120, marginBottom: 24, padding: 24, display: "flex", justifyContent: "center", alignItems: "center" }}>
            {progressType === "bar" ? (
              <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                <div
                  style={{
                    width: width ? `${width}px` : "300px",
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
                {showPercentage === "yes" && (
                  <span style={{ marginLeft: 12, fontSize: 14 }}>{progressValue}%</span>
                )}
              </div>
            ) : (
              <div style={{ position: "relative", width: `${width}px`, height: `${width}px` }}>
                <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke={bgColor}
                    strokeWidth="2"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke={progressColor}
                    strokeWidth="2"
                    strokeDasharray={`${progressValue} ${100 - parseInt(progressValue)}`}
                    style={{ transition: "stroke-dasharray 0.3s ease" }}
                  />
                </svg>
                {showPercentage === "yes" && (
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 14 }}>
                    {progressValue}%
                  </div>
                )}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Button fullWidth secondary onClick={onBack}>
              Tutup
            </Button>
            <Button fullWidth onClick={handleCreateProgressIndicator}>
              Buat
            </Button>
          </div>
          <Text style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Kode :</Text>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, background: "#f8f9fa", minHeight: 80, padding: 16, fontFamily: "monospace", fontSize: 13, color: "#222", wordBreak: "break-all", position: "relative" }}>
            <Textbox value={htmltailwind} onValueInput={() => {}} style={{ background: "transparent", border: "none", width: "100%", minHeight: 60 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

