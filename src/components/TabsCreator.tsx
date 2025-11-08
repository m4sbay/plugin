import { Button, Dropdown, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useState, useCallback, useEffect } from "preact/hooks";
import { InputField } from "./ui/InputField";
import { ColorPicker } from "./ui/ColorPicker";

export function TabsCreator({ onBack }: { onBack: () => void }) {
  // State untuk Tabs - sesuai template HTML/Tailwind
  const [tabCount, setTabCount] = useState("3");
  const [tabLabels, setTabLabels] = useState("Account,Password,Settings");
  const [fontSize, setFontSize] = useState("14");

  // Warna sesuai template
  const [containerBgColor, setContainerBgColor] = useState("#F1F5F9"); // slate-100
  const [activeBgColor, setActiveBgColor] = useState("#FFFFFF"); // white
  const [activeTextColor, setActiveTextColor] = useState("#0F172A"); // slate-900
  const [inactiveTextColor, setInactiveTextColor] = useState("#475569"); // slate-600

  // Styling
  const [tabPadding, setTabPadding] = useState("6,24"); // py,px
  const [tabBorderRadius, setTabBorderRadius] = useState("9999"); // rounded-full
  const [tabGap, setTabGap] = useState("4"); // gap antar tab
  const [containerPadding, setContainerPadding] = useState("4"); // padding container
  const [tabsWidth, setTabsWidth] = useState(""); // lebar tabs container (px)

  // Panel contents
  const [panelContents, setPanelContents] = useState("Make changes to your account here.,Change your password here.,Update your settings here.");

  // Transisi
  const [transitionType, setTransitionType] = useState("normal");
  const transitionOptions = [
    { value: "none", text: "Tanpa Transisi" },
    { value: "fast", text: "Cepat (150ms)" },
    { value: "normal", text: "Normal (300ms)" },
    { value: "slow", text: "Lambat (500ms)" },
  ];

  const [htmltailwind, setHtmltailwind] = useState("");
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Generate Tailwind code - hanya div tabs container dengan radio button pattern untuk fungsi tabs
  const generateCode = useCallback(() => {
    const labels = tabLabels.split(",").map(l => l.trim());
    const contents = panelContents.split(",").map(c => c.trim());
    const tabCountNum = parseInt(tabCount) || labels.length;
    const gap = tabGap || "4";
    const containerPad = containerPadding || "4";
    const width = tabsWidth ? `w-[${tabsWidth}px]` : "w-full";

    // Generate radio inputs (untuk state management - hidden)
    const radioInputs = labels
      .slice(0, tabCountNum)
      .map((_, idx) => `<input type="radio" name="tabs" id="tab-${idx}" class="hidden" ${idx === 0 ? "checked" : ""}>`)
      .join("\n    ");

    // Generate tab labels dengan class Tailwind
    const tabLabelsHtml = labels
      .slice(0, tabCountNum)
      .map((label, idx) => {
        const py = tabPadding.split(",")[0]?.trim() || "6";
        const px = tabPadding.split(",")[1]?.trim() || "24";
        const borderRadius = tabBorderRadius || "9999";
        const transition = transitionType !== "none" ? `transition-all duration-${transitionType === "fast" ? "150" : transitionType === "slow" ? "500" : "300"}` : "";

        return `<label for="tab-${idx}" class="inline-flex items-center justify-center h-10 rounded-[${borderRadius}px] px-[${px}px] py-[${py}px] text-[${inactiveTextColor}] ${transition}">
        ${label}
      </label>`;
      })
      .join("\n      ");

    // Generate panels
    const panelsHtml = contents
      .slice(0, tabCountNum)
      .map(
        (content, idx) =>
          `<div id="panel-${idx}" class="tab-panel">
        <p class="text-md text-slate-500 text-center">${content}</p>
      </div>`
      )
      .join("\n      ");

    // Generate CSS untuk active state dan panel visibility
    const activeStateCSS = labels
      .slice(0, tabCountNum)
      .map((_, idx) => `#tab-${idx}:checked ~ .tabs-list label[for="tab-${idx}"]`)
      .join(",\n    ");

    const panelVisibilityCSS = labels
      .slice(0, tabCountNum)
      .map((_, idx) => `#tab-${idx}:checked ~ .tab-panels #panel-${idx}`)
      .join(",\n    ");

    // Hanya komponen div tabs container dengan radio button pattern
    const html = `
    <div class="min-h-screen flex flex-col items-center justify-center">
    <style>
    .tab-panel { display: none; }
    ${panelVisibilityCSS} { display: block; }
    ${activeStateCSS} {
      background-color: ${activeBgColor};
      color: ${activeTextColor};
      box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 1px 3px rgba(0,0,0,.1);
      font-weight: 600;
    }
      </div>
  </style>

    <!-- Radio inputs untuk state management -->
    ${radioInputs}

    <!-- Tabs List Container -->
    <div class="tabs-list grid grid-cols-${tabCountNum} ${width} bg-[${containerBgColor}] rounded-full p-[${containerPad}px] gap-[${gap}px] mb-[4px]">
      ${tabLabelsHtml}
    </div>

    <!-- Panels Container -->
    <div class="tab-panels text-center mt-4">
      ${panelsHtml}
    </div>`;

    setHtmltailwind(html);
    return html;
  }, [tabCount, tabLabels, fontSize, containerBgColor, activeBgColor, activeTextColor, inactiveTextColor, tabPadding, tabBorderRadius, tabGap, containerPadding, panelContents, transitionType, tabsWidth]);

  useEffect(() => {
    generateCode();
  }, [generateCode]);

  // Emit ke Figma
  const handleCreateTabs = () => {
    emit("CREATE_TABS", {
      tabCount,
      tabLabels,
      fontSize,
      containerBgColor,
      activeBgColor,
      activeTextColor,
      inactiveTextColor,
      tabPadding,
      tabBorderRadius,
      tabGap,
      containerPadding,
      panelContents,
      transitionType,
      tabsWidth,
      htmltailwind,
    });
  };

  const labels = tabLabels.split(",").map(l => l.trim());
  const contents = panelContents.split(",").map(c => c.trim());

  const tabCountNum = parseInt(tabCount) || labels.length;
  const py = tabPadding.split(",")[0]?.trim() || "6";
  const px = tabPadding.split(",")[1]?.trim() || "24";
  const borderRadius = tabBorderRadius || "9999";
  const gap = tabGap || "4";
  const containerPad = containerPadding || "4";

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
        <Text style={{ fontSize: 28, fontWeight: 600, color: "#222" }}>Tabs</Text>
      </div>
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Kolom 1: Style Statis */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Style Statis :</Text>
          <VerticalSpace space="small" />
          <InputField label="Lebar tabs container (px) :" value={tabsWidth} onChange={setTabsWidth} placeholder="Contoh: 500 (tidak boleh kosong)" />
          <InputField label="Jumlah Tab :" value={tabCount} onChange={setTabCount} placeholder="Contoh: 3" />
          <InputField label="Label Tab (pisahkan dengan koma) :" value={tabLabels} onChange={setTabLabels} placeholder="Contoh: Account,Password,Settings" />
          <InputField label="Konten Panel (pisahkan dengan koma) :" value={panelContents} onChange={setPanelContents} placeholder="Contoh: Content 1,Content 2,Content 3" />
          <InputField label="Ukuran teks (px):" value={fontSize} onChange={setFontSize} placeholder="Contoh: 14" />
          <ColorPicker label="Warna background container :" value={containerBgColor} onChange={setContainerBgColor} />
          <ColorPicker label="Warna background tab aktif :" value={activeBgColor} onChange={setActiveBgColor} />
          <ColorPicker label="Warna teks tab aktif :" value={activeTextColor} onChange={setActiveTextColor} />
          <ColorPicker label="Warna teks tab tidak aktif :" value={inactiveTextColor} onChange={setInactiveTextColor} />
          <InputField label="Padding tab (py,px) :" value={tabPadding} onChange={setTabPadding} placeholder="Contoh: 6,24" />
          <InputField label="Border radius tab (px) :" value={tabBorderRadius} onChange={setTabBorderRadius} placeholder="Contoh: 9999 (rounded-full)" />
          <InputField label="Gap antar tab (px) :" value={tabGap} onChange={setTabGap} placeholder="Contoh: 4" />
          <InputField label="Padding container (px) :" value={containerPadding} onChange={setContainerPadding} placeholder="Contoh: 4" />

          <div style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, display: "block" }}>Tipe Transisi :</Text>
            <Dropdown options={transitionOptions} value={transitionType} onValueChange={setTransitionType} />
          </div>
        </div>

        {/* Kolom 2: Live Preview & Kode */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 500, position: "sticky", top: 24, alignSelf: "flex-start", zIndex: 2 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Live Preview :</Text>
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "#f8f9fa",
              minHeight: 200,
              marginBottom: 24,
              padding: 24,
              width: tabsWidth ? `${tabsWidth}px` : "auto",
              overflowX: "auto",
              overflowY: "visible",
            }}
          >
            {/* Preview Tabs Container */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${tabCountNum}, 1fr)`,
                width: tabsWidth ? `${tabsWidth}px` : "100%",
                background: containerBgColor,
                borderRadius: 9999,
                padding: `${containerPad}px`,
                gap: `${gap}px`,
                marginBottom: 4,
              }}
            >
              {labels.slice(0, tabCountNum).map((label, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTabIndex(idx)}
                  style={{
                    background: idx === activeTabIndex ? activeBgColor : "transparent",
                    color: idx === activeTabIndex ? activeTextColor : inactiveTextColor,
                    fontSize: fontSize ? `${fontSize}px` : "14px",
                    padding: `${py}px ${px}px`,
                    border: "none",
                    borderRadius: `${borderRadius}px`,
                    cursor: "pointer",
                    fontWeight: idx === activeTabIndex ? 600 : 400,
                    boxShadow: idx === activeTabIndex ? "0 1px 2px rgba(0,0,0,.05), 0 1px 3px rgba(0,0,0,.1)" : "none",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "40px",
                    transition: transitionType !== "none" ? `all ${transitionType === "fast" ? 150 : transitionType === "slow" ? 500 : 300}ms` : "none",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Preview Panel */}
            <div style={{ minHeight: 60, padding: "12px 0", textAlign: "center", margin: 0 }}>{contents[activeTabIndex] && <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>{contents[activeTabIndex]}</p>}</div>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Button fullWidth secondary onClick={onBack}>
              Tutup
            </Button>
            <Button fullWidth onClick={handleCreateTabs}>
              Buat
            </Button>
          </div>
          <Text style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Kode :</Text>
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "#f8f9fa",
              minHeight: 80,
              padding: 16,
              fontFamily: "monospace",
              fontSize: 11,
              color: "#222",
              wordBreak: "break-all",
              position: "relative",
              maxHeight: 300,
              overflow: "auto",
            }}
          >
            <Textbox value={htmltailwind} onValueInput={() => {}} style={{ background: "transparent", border: "none", width: "100%", minHeight: 60, fontSize: 11 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
