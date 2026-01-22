import { Button, Dropdown, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
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
  // State Style Statis - Track
  const [switchWidth, setSwitchWidth] = useState("51"); // w-[51px]
  const [switchHeight, setSwitchHeight] = useState("31"); // h-[31px]
  const [trackBorderRadius, setTrackBorderRadius] = useState("16"); // rounded-[16px]
  const [uncheckedBgColor, setUncheckedBgColor] = useState("rgba(118,118,128,0.12)"); // bg unchecked
  const [checkedBgColor, setCheckedBgColor] = useState("#00BCFF"); // peer-checked:bg

  // State Style Statis - Thumb
  const [thumbSize, setThumbSize] = useState("27"); // h-[27px] w-[27px]
  const [thumbBgColor, setThumbBgColor] = useState("#FFFFFF"); // bg-white

  // State Style Dinamis - Transition
  const [transitionDuration, setTransitionDuration] = useState("300"); // duration-300
  const [transitionEasing, setTransitionEasing] = useState("ease-in-out"); // ease-in-out
  const transitionEasingOptions = [
    { value: "ease-in-out", text: "Ease In Out" },
    { value: "ease-in", text: "Ease In" },
    { value: "ease-out", text: "Ease Out" },
    { value: "linear", text: "Linear" },
  ];
  const [defaultChecked, setDefaultChecked] = useState("false"); // default checked state

  const [htmltailwind, setHtmltailwind] = useState("");
  const [copied, setCopied] = useState(false);
  const [previewChecked, setPreviewChecked] = useState(false);

  // Generate HTML string menggunakan useMemo
  const htmlCode = useMemo(() => {
    const translateX = parseInt(switchWidth) - parseInt(thumbSize) - 4; // 2px left + 2px spacing
    const isChecked = defaultChecked === "true";

    return `<label for="toggle-switch" class="relative inline-flex cursor-pointer items-center"><input type="checkbox" id="toggle-switch" class="peer sr-only" ${isChecked ? "checked" : ""} /><div class="peer flex h-[${switchHeight}px] w-[${switchWidth}px] items-center rounded-[${trackBorderRadius}px] bg-[${uncheckedBgColor}] transition-all duration-${transitionDuration} ${transitionEasing} peer-checked:bg-[${checkedBgColor}] peer-focus:outline-none"></div><div class="absolute top-[2px] left-[2px] h-[${thumbSize}px] w-[${thumbSize}px] rounded-full bg-[${thumbBgColor}] shadow-sm transition-all duration-${transitionDuration} ${transitionEasing} peer-checked:translate-x-[${translateX}px]"></div></label>`;
  }, [switchWidth, switchHeight, trackBorderRadius, uncheckedBgColor, checkedBgColor, thumbSize, thumbBgColor, transitionDuration, transitionEasing, defaultChecked]);

  // Format HTML secara async
  useEffect(() => {
    (async () => {
      const formattedHtml = await formatHTML(htmlCode);
      setHtmltailwind(formattedHtml);
    })();
  }, [htmlCode]);

  // Update preview checked state when defaultChecked changes
  useEffect(() => {
    setPreviewChecked(defaultChecked === "true");
  }, [defaultChecked]);

  useEffect(() => {
    on<SelectionChangeHandler>("SELECTION_CHANGE", data => {
      if (!data) {
        return;
      }
      try {
        const parsed = JSON.parse(data);
        if (parsed?.componentType === "switch") {
          if (parsed.switchWidth !== undefined) setSwitchWidth(parsed.switchWidth || "51");
          if (parsed.switchHeight !== undefined) setSwitchHeight(parsed.switchHeight || "31");
          if (parsed.trackBorderRadius !== undefined) setTrackBorderRadius(parsed.trackBorderRadius || "16");
          if (parsed.uncheckedBgColor !== undefined) setUncheckedBgColor(parsed.uncheckedBgColor || "rgba(118,118,128,0.12)");
          if (parsed.checkedBgColor !== undefined) setCheckedBgColor(parsed.checkedBgColor || "#00BCFF");
          if (parsed.thumbSize !== undefined) setThumbSize(parsed.thumbSize || "27");
          if (parsed.thumbBgColor !== undefined) setThumbBgColor(parsed.thumbBgColor || "#FFFFFF");
          if (parsed.transitionDuration !== undefined) setTransitionDuration(parsed.transitionDuration || "300");
          if (parsed.transitionEasing !== undefined) setTransitionEasing(parsed.transitionEasing || "ease-in-out");
          if (parsed.defaultChecked !== undefined) setDefaultChecked(parsed.defaultChecked || "false");
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
      switchWidth,
      switchHeight,
      trackBorderRadius,
      uncheckedBgColor,
      checkedBgColor,
      thumbSize,
      thumbBgColor,
      transitionDuration,
      transitionEasing,
      defaultChecked,
      htmltailwind,
    });
  };

  const translateX = parseInt(switchWidth) - parseInt(thumbSize) - 4;

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
          <InputField label="Lebar switch (px) :" value={switchWidth} onChange={setSwitchWidth} placeholder="Contoh: 51" />
          <InputField label="Tinggi switch (px) :" value={switchHeight} onChange={setSwitchHeight} placeholder="Contoh: 31" />
          <InputField label="Border radius track (px) :" value={trackBorderRadius} onChange={setTrackBorderRadius} placeholder="Contoh: 16" />
          <ColorPicker label="Background (unchecked) :" value={uncheckedBgColor} onChange={setUncheckedBgColor} />
          <ColorPicker label="Background (checked) :" value={checkedBgColor} onChange={setCheckedBgColor} />

          <InputField label="Ukuran thumb (Toggle Circle) (px) :" value={thumbSize} onChange={setThumbSize} placeholder="Contoh: 27" />
          <ColorPicker label="Warna thumb :" value={thumbBgColor} onChange={setThumbBgColor} />
        </div>

        {/* Kolom 2: Style Dinamis */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 20, color: theme.primaryText }}>Style Dinamis :</Text>
          <VerticalSpace space="large" />

          <InputField label="Durasi transisi (ms) :" value={transitionDuration} onChange={setTransitionDuration} placeholder="Contoh: 300" />

          <Text style={{ fontWeight: 400, fontSize: 11, marginBottom: 8, color: "#6b7280" }}>Tipe Transisi :</Text>
          <Dropdown options={transitionEasingOptions} value={transitionEasing} onValueChange={setTransitionEasing} />
          <VerticalSpace space="large" />

          <Text style={{ fontWeight: 400, fontSize: 11, marginBottom: 8, color: "#6b7280" }}>Default State :</Text>
          <Dropdown
            options={[
              { value: "false", text: "Off (Unchecked)" },
              { value: "true", text: "On (Checked)" },
            ]}
            value={defaultChecked}
            onValueChange={setDefaultChecked}
          />
        </div>

        {/* Kolom 3: Live Preview & Kode */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 400, position: "sticky", top: 24, alignSelf: "flex-start", zIndex: 2, display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
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
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
              overflow: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <label
              style={{
                position: "relative",
                display: "inline-flex",
                height: `${switchHeight}px`,
                width: `${switchWidth}px`,
                cursor: "pointer",
                alignItems: "center",
              }}
              onClick={() => setPreviewChecked(!previewChecked)}
            >
              <input type="checkbox" checked={previewChecked} onChange={() => setPreviewChecked(!previewChecked)} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  height: `${switchHeight}px`,
                  width: `${switchWidth}px`,
                  alignItems: "center",
                  borderRadius: `${trackBorderRadius}px`,
                  background: previewChecked ? checkedBgColor : uncheckedBgColor,
                  transition: `all ${transitionDuration}ms ${transitionEasing}`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "2px",
                  left: "2px",
                  height: `${thumbSize}px`,
                  width: `${thumbSize}px`,
                  borderRadius: "50%",
                  background: thumbBgColor,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  transform: previewChecked ? `translateX(${translateX}px)` : "translateX(0)",
                  transition: `all ${transitionDuration}ms ${transitionEasing}`,
                }}
              />
            </label>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Button fullWidth danger onClick={onBack}>
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
          <Button onClick={handleCopyCode} style={{ padding: "4px 12px", fontSize: 12, height: "auto" }}>
            {copied ? "Tersalin!" : "Copy"}
          </Button>
        </div>
      </div>
    </div>
  );
}
