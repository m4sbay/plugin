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

type TabsCreatorProps = {
  onBack: () => void;
  isDark?: boolean;
};

export function TabsCreator({ onBack, isDark = false }: TabsCreatorProps) {
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
  // State untuk Tabs - sesuai template HTML/Tailwind
  const [tabCount, setTabCount] = useState("3");
  const [tabLabels, setTabLabels] = useState("Profile,Settings,Activity");
  const [fontSize, setFontSize] = useState("14"); // arbitrary value untuk text-[value]px

  // Warna sesuai template - menggunakan hex colors untuk arbitrary values
  const [activeTextColor, setActiveTextColor] = useState("#4F46E5"); // text color untuk tab aktif (indigo-600)
  const [activeBorderColor, setActiveBorderColor] = useState("#6366F1"); // border color untuk tab aktif (indigo-500)
  const [inactiveTextColor, setInactiveTextColor] = useState("#707070"); // text color untuk tab tidak aktif (slate-500)
  const [hoverTextColor, setHoverTextColor] = useState("#171717"); // text color saat hover (slate-700)
  const [hoverBorderColor, setHoverBorderColor] = useState("#CBD5E1"); // border color saat hover (slate-300)

  // Styling - menggunakan arbitrary values
  const [tabGap, setTabGap] = useState("16"); // arbitrary value untuk gap-[value]px
  const [textBorderGap, setTextBorderGap] = useState("12"); // jarak antara text dan border bottom

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
  const [hoveredTabIndex, setHoveredTabIndex] = useState<number | null>(null);

  // Helper function untuk normalize hex color (pastikan ada # di depan)
  const normalizeHex = useCallback((color: string): string => {
    if (!color) return "#000000";
    // Hapus # jika ada, lalu tambahkan kembali
    const cleanColor = color.replace("#", "").toUpperCase();
    return `#${cleanColor}`;
  }, []);

  // Generate Tailwind code - border-bottom tabs (UI statis saja, hanya Tailwind classes dengan arbitrary values)
  const generateCode = useCallback(async () => {
    const labels = tabLabels.split(",").map(l => l.trim());
    const tabCountNum = parseInt(tabCount) || labels.length;
    const gap = tabGap || "16";
    const textSize = fontSize || "14";
    const textBorderGapValue = textBorderGap || "12";

    // Normalize hex colors
    const activeTextHex = normalizeHex(activeTextColor);
    const activeBorderHex = normalizeHex(activeBorderColor);
    const inactiveTextHex = normalizeHex(inactiveTextColor);
    const hoverTextHex = normalizeHex(hoverTextColor);
    const hoverBorderHex = normalizeHex(hoverBorderColor);

    // Generate tab buttons dengan border-bottom style (menggunakan arbitrary values dengan hex)
    // Menggunakan flex column dengan gap untuk jarak antara text dan border
    const tabButtonsHtml = labels
      .slice(0, tabCountNum)
      .map((label, idx) => {
        const isActive = idx === 0;

        if (isActive) {
          // Tab aktif: menggunakan flex column dengan gap untuk jarak text dan border
          return `          <button class="pb-[${textBorderGapValue}px] flex flex-col gap-[${textBorderGapValue}px] border-b-2 border-[${activeBorderHex}] text-[${textSize}px] font-medium text-[${activeTextHex}]">
            <span>${label}</span>
          </button>`;
        } else {
          // Tab tidak aktif: menggunakan flex column dengan gap untuk jarak text dan border
          return `          <button class="pb-0 flex flex-col gap-[${textBorderGapValue}px] border-b-2 border-transparent text-[${textSize}px] font-medium text-[${inactiveTextHex}] hover:text-[${hoverTextHex}] hover:border-[${hoverBorderHex}]">
            <span>${label}</span>
          </button>`;
        }
      })
      .join("\n\n");

    // HTML structure dengan border-bottom tabs (menggunakan arbitrary values)
    const html = `<div class="flex gap-[${gap}px]">${tabButtonsHtml}</div>`;

    const formattedHtml = await formatHTML(html);
    setHtmltailwind(formattedHtml);
    return formattedHtml;
  }, [tabCount, tabLabels, fontSize, activeTextColor, activeBorderColor, inactiveTextColor, hoverTextColor, hoverBorderColor, tabGap, textBorderGap, normalizeHex]);

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
        if (parsed?.componentType === "tabs") {
          if (parsed.tabCount !== undefined) setTabCount(parsed.tabCount || "3");
          if (parsed.tabLabels !== undefined) setTabLabels(parsed.tabLabels || "Profile,Settings,Activity");
          if (parsed.fontSize !== undefined) setFontSize(parsed.fontSize || "14");
          if (parsed.activeTextColor !== undefined) setActiveTextColor(parsed.activeTextColor || "#4F46E5");
          if (parsed.activeBorderColor !== undefined) setActiveBorderColor(parsed.activeBorderColor || "#6366F1");
          if (parsed.inactiveTextColor !== undefined) setInactiveTextColor(parsed.inactiveTextColor || "#64748B");
          if (parsed.hoverTextColor !== undefined) setHoverTextColor(parsed.hoverTextColor || "#334155");
          if (parsed.hoverBorderColor !== undefined) setHoverBorderColor(parsed.hoverBorderColor || "#CBD5E1");
          if (parsed.tabGap !== undefined) setTabGap(parsed.tabGap || "16");
          if (parsed.textBorderGap !== undefined) setTextBorderGap(parsed.textBorderGap || "8");
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
  const handleCreateTabs = () => {
    emit("CREATE_TABS", {
      tabCount,
      tabLabels,
      fontSize,
      activeTextColor,
      activeBorderColor,
      inactiveTextColor,
      hoverTextColor,
      hoverBorderColor,
      tabGap,
      textBorderGap,
      htmltailwind,
    });
  };

  const labels = tabLabels.split(",").map(l => l.trim());

  const tabCountNum = parseInt(tabCount) || labels.length;

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
        <Text style={{ fontSize: 28, fontWeight: 600, color: theme.primaryText }}>Tabs</Text>
      </div>
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Kolom 1: Style Statis */}
        <div style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto", flex: 1, minWidth: 260 }}>
          <VerticalSpace space="small" />
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, color: theme.primaryText }}>Style Statis :</Text>
          <VerticalSpace space="small" />
          <InputField label="Jumlah Tab :" value={tabCount} onChange={setTabCount} placeholder="Contoh: 3" />
          <InputField label="Label Tab (pisahkan dengan koma) :" value={tabLabels} onChange={setTabLabels} placeholder="Contoh: Profile,Settings,Activity" />
          <InputField label="Ukuran teks (px) :" value={fontSize} onChange={setFontSize} placeholder="Contoh: 14 (akan menjadi text-[14px])" />
          <ColorPicker label="Warna teks tab aktif :" value={activeTextColor} onChange={setActiveTextColor} />
          <ColorPicker label="Warna border tab aktif :" value={activeBorderColor} onChange={setActiveBorderColor} />
          <ColorPicker label="Warna teks tab tidak aktif :" value={inactiveTextColor} onChange={setInactiveTextColor} />
          <InputField label="Gap antar tab (px) :" value={tabGap} onChange={setTabGap} placeholder="Contoh: 16 (akan menjadi gap-[16px])" />
          <InputField label="Jarak text dan border (px) :" value={textBorderGap} onChange={setTextBorderGap} placeholder="Contoh: 8" />
        </div>

        {/* Kolom 2: Style Dinamis */}
        <div style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto", flex: 1, minWidth: 260 }}>
          <VerticalSpace space="small" />
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, color: theme.primaryText }}>Style Dinamis :</Text>
          <VerticalSpace space="small" />
          <ColorPicker label="Warna teks saat hover :" value={hoverTextColor} onChange={setHoverTextColor} />
          <ColorPicker label="Warna border saat hover :" value={hoverBorderColor} onChange={setHoverBorderColor} />
          <div>
          <Text style={{ fontWeight: 400, fontSize: 11, marginBottom:10, color: "#6b7280" }}>Tipe Transisi :</Text>
            <Dropdown options={transitionOptions} value={transitionType} onValueChange={setTransitionType} />
          </div>
        </div>

        {/* Kolom 3: Live Preview & Kode */}
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
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {/* Preview Tabs Container - Flex Layout dengan Border Bottom */}
            <div
              style={{
                width: "100%",
                display: "flex",
                gap: `${tabGap || "16"}px`,
                justifyContent: "flex-start",
                paddingBottom: 12,
                paddingTop: 12,
              }}
            >
              {labels.slice(0, tabCountNum).map((label, idx) => {
                const isActive = idx === 0;
                const isHovered = hoveredTabIndex === idx;
                // Gunakan nilai input langsung untuk preview
                const fontSizeValue = `${fontSize || "14"}px`;
                const textBorderGapValue = `${textBorderGap || "8"}px`;

                // Normalize hex colors untuk preview (pastikan ada #)
                const normalizeHexForPreview = (color: string): string => {
                  if (!color) return "#000000";
                  return color.startsWith("#") ? color : `#${color}`;
                };

                // Tentukan warna teks berdasarkan state
                let textColor = normalizeHexForPreview(isActive ? activeTextColor : inactiveTextColor);
                if (!isActive && isHovered) {
                  textColor = normalizeHexForPreview(hoverTextColor);
                }

                // Tentukan warna border berdasarkan state
                let borderColor = "transparent";
                if (isActive) {
                  borderColor = normalizeHexForPreview(activeBorderColor);
                } else if (isHovered) {
                  borderColor = normalizeHexForPreview(hoverBorderColor);
                }

                // Tentukan durasi transisi berdasarkan transitionType
                const getTransitionDuration = () => {
                  switch (transitionType) {
                    case "none":
                      return "0ms";
                    case "fast":
                      return "150ms";
                    case "normal":
                      return "300ms";
                    case "slow":
                      return "500ms";
                    default:
                      return "300ms";
                  }
                };

                const transitionDuration = getTransitionDuration();

                return (
                  <button
                    key={idx}
                    onMouseEnter={() => setHoveredTabIndex(idx)}
                    onMouseLeave={() => setHoveredTabIndex(null)}
                    style={{
                      background: "transparent",
                      color: textColor,
                      fontSize: fontSizeValue,
                      paddingTop: 0,
                      paddingBottom: 0,
                      paddingLeft: 0,
                      paddingRight: 0,
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 500,
                      display: "inline-flex",
                      flexDirection: "column",
                      gap: textBorderGapValue,
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      minHeight: 0,
                      transition: `color ${transitionDuration} ease, border-color ${transitionDuration} ease`,
                    }}
                  >
                    <span style={{ display: "block" }}>{label}</span>
                    <div
                      style={{
                        width: "100%",
                        height: "2px",
                        backgroundColor: borderColor,
                        transition: `background-color ${transitionDuration} ease`,
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Button fullWidth danger onClick={onBack}>
              Tutup
            </Button>
            <Button fullWidth onClick={handleCreateTabs}>
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
