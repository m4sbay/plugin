import { Button, Columns, Container, Dropdown, Muted, Text, Textbox, TextboxNumeric, VerticalSpace } from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import "../style.css";
import { CloseHandler, CreateButtonHandler, SelectionChangeHandler } from "../types/types";
import { InputField } from "./ui/InputField";
import { ColorPicker } from "./ui/ColorPicker";

export function ButtonCreator({ onBack }: { onBack: () => void }) {
  // Static styling properties
  const [color, setColor] = useState("#171717");
  const [label, setLabel] = useState("Tombol");
  const [borderRadius, setBorderRadius] = useState<number | null>(8);
  const [fontSize, setFontSize] = useState<number | null>(16);
  const [padding, setPadding] = useState("10");
  const [labelColor, setLabelColor] = useState("#FFFFFF");
  const [borderWidth, setBorderWidth] = useState<number | null>(0);
  const [borderColor, setBorderColor] = useState("#000000");
  const [htmltailwind, setHtmltailwind] = useState("");
  const [colorError, setColorError] = useState("");
  const [labelColorError, setLabelColorError] = useState("");

  // Dynamic styling properties
  const [hoverTextColor, setHoverTextColor] = useState("#FFFFFF");
  const [hoverBgColor, setHoverBgColor] = useState("#404040");
  const [hoverBorderColor, setHoverBorderColor] = useState("");
  const [focusBorderColor, setFocusBorderColor] = useState("#3B82F6");
  const [focusRingSize, setFocusRingSize] = useState<number | null>(2);
  const [activeScale, setActiveScale] = useState<number | null>(95);
  const [activeBgColor, setActiveBgColor] = useState("#525252");
  const [activeShadowSize, setActiveShadowSize] = useState<number | null>(4);
  const [transitionDuration, setTransitionDuration] = useState<number | null>(150);
  const [transitionEasing, setTransitionEasing] = useState("ease-in-out");
  const [transitionDelay, setTransitionDelay] = useState<number | null>(0);
  const [transitionType, setTransitionType] = useState("normal");
  const [hoverScaleType, setHoverScaleType] = useState("none");
  const [hoverOpacity, setHoverOpacity] = useState<number | null>(90);
  const [hoverScale, setHoverScale] = useState<number | null>(105);
  const [hoverTranslateX, setHoverTranslateX] = useState<number | null>(0);
  const [hoverRotate, setHoverRotate] = useState<number | null>(0);

  // Live preview state
  const [previewHtml, setPreviewHtml] = useState("");

  // Transition options for dropdown
  const transitionOptions = [
    { value: "none", text: "Tidak ada transisi" },
    { value: "fast", text: "Transisi Cepat (150ms)" },
    { value: "normal", text: "Transisi Normal (300ms)" },
    { value: "slow", text: "Transisi Lambat (500ms)" },
  ];

  // Hover scale options for dropdown
  const hoverScaleOptions = [
    { value: "none", text: "Tidak ada skala" },
    { value: "small", text: "Skala Kecil (105%)" },
    { value: "medium", text: "Skala Sedang (110%)" },
    { value: "large", text: "Skala Besar (115%)" },
  ];

  // Get transition duration based on type
  const getTransitionDuration = (type: string): number => {
    switch (type) {
      case "fast":
        return 150;
      case "normal":
        return 300;
      case "slow":
        return 500;
      default:
        return 0;
    }
  };

  // Get hover scale value based on type
  const getHoverScaleValue = (type: string): number => {
    switch (type) {
      case "small":
        return 105;
      case "medium":
        return 110;
      case "large":
        return 115;
      default:
        return 100;
    }
  };

  const cleanHexColor = (hex: string): string => {
    let cleaned = hex.trim().toUpperCase();
    if (!cleaned.startsWith("#")) {
      cleaned = `#${cleaned}`;
    }
    if (cleaned.length === 4) {
      cleaned = `#${cleaned[1]}${cleaned[1]}${cleaned[2]}${cleaned[2]}${cleaned[3]}${cleaned[3]}`;
    }
    if (!/^#[0-9A-F]{6}$/.test(cleaned)) {
      console.log(`Invalid color: ${hex} -> Using default #000000`);
      setColorError("Warna tidak valid, menggunakan default");
      return "#000000";
    }
    setColorError("");
    return cleaned;
  };

  const handleColorChange = (e: any) => {
    const newColor = cleanHexColor(e.target.value);
    console.log(`Color picker changed: ${e.target.value} -> ${newColor}`);
    setColor(newColor);
  };

  const handleLabelColorChange = (e: any) => {
    const newColor = cleanHexColor(e.target.value);
    console.log(`Label color picker changed: ${e.target.value} -> ${newColor}`);
    setLabelColor(newColor);
    if (!/^#[0-9A-F]{6}$/.test(newColor)) {
      setLabelColorError("Warna label tidak valid, menggunakan default");
    } else {
      setLabelColorError("");
    }
  };

  // Dynamic styling handlers
  const handleHoverTextColorChange = (e: any) => {
    const newColor = cleanHexColor(e.target.value);
    setHoverTextColor(newColor);
  };

  const handleHoverBgColorChange = (e: any) => {
    const newColor = cleanHexColor(e.target.value);
    setHoverBgColor(newColor);
  };

  const handleHoverBorderColorChange = (e: any) => {
    const newColor = cleanHexColor(e.target.value);
    setHoverBorderColor(newColor);
  };

  const handleFocusBorderColorChange = (e: any) => {
    const newColor = cleanHexColor(e.target.value);
    setFocusBorderColor(newColor);
  };

  const handleActiveBgColorChange = (e: any) => {
    const newColor = cleanHexColor(e.target.value);
    setActiveBgColor(newColor);
  };

  const handleBorderColorChange = (e: any) => {
    const newColor = cleanHexColor(e.target.value);
    setBorderColor(newColor);
  };

  // Convert Tailwind classes to inline styles for preview
  const generatePreviewWithInlineStyles = useCallback(() => {
    if (borderRadius === null || fontSize === null) return "";

    const cleanHexColor = color.replace("#", "");
    const cleanHexLabelColor = labelColor.replace("#", "");

    // Calculate padding
    let paddingStyle = "10px";
    if (padding) {
      const values = padding.split(",").map(val => parseInt(val.trim(), 10));
      if (values.length === 1 && !isNaN(values[0])) {
        paddingStyle = `${values[0]}px`;
      } else if (values.length === 2 && !isNaN(values[0]) && !isNaN(values[1])) {
        paddingStyle = `${values[1]}px ${values[0]}px`;
      }
    }

    // Build inline styles
    const styles = {
      backgroundColor: `#${cleanHexColor}`,
      color: `#${cleanHexLabelColor}`,
      borderRadius: `${borderRadius}px`,
      fontSize: `${fontSize}px`,
      padding: paddingStyle,
      border: borderWidth && borderWidth > 0 ? `${borderWidth}px solid #${borderColor.replace("#", "")}` : "none",
      fontFamily: "Inter, system-ui, sans-serif",
      cursor: "pointer",
      transition: transitionType !== "none" ? `all ${getTransitionDuration(transitionType)}ms ease-in-out` : "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      outline: "none",
      transform: hoverScaleType !== "none" ? `scale(${getHoverScaleValue(hoverScaleType) / 100})` : "scale(1)",
    };

    // Convert styles object to string
    const styleString = Object.entries(styles)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value}`)
      .join("; ");

    return `<button style="${styleString}">${label}</button>`;
  }, [
    color,
    label,
    borderRadius,
    fontSize,
    padding,
    labelColor,
    borderWidth,
    borderColor,
    hoverTextColor,
    hoverBgColor,
    hoverBorderColor,
    focusBorderColor,
    focusRingSize,
    activeScale,
    activeBgColor,
    activeShadowSize,
    transitionType,
    transitionEasing,
    transitionDelay,
    hoverScaleType,
    hoverOpacity,
    hoverScale,
    hoverTranslateX,
    hoverRotate,
  ]);

  // Update preview with inline styles
  useEffect(() => {
    const preview = generatePreviewWithInlineStyles();
    setPreviewHtml(preview);
  }, [generatePreviewWithInlineStyles]);

  const generateCode = useCallback(
    (hexColor: string, label: string, borderRadius: number, fontSize: number, padding: string, hexLabelColor: string) => {
      let tailwindPadding = "";
      if (padding) {
        const values = padding.split(",").map(val => parseInt(val.trim(), 10));
        if (values.length === 1 && !isNaN(values[0])) {
          tailwindPadding = `p-[${values[0]}px]`;
        } else if (values.length === 2 && !isNaN(values[0]) && !isNaN(values[1])) {
          tailwindPadding = `py-[${values[1]}px] px-[${values[0]}px]`;
        }
      }

      const cleanHexColor = hexColor.replace("#", "");
      const cleanHexLabelColor = hexLabelColor.replace("#", "");

      // Base classes
      let classes = `bg-[#${cleanHexColor}] rounded-[${borderRadius}px] text-[${fontSize}px] ${tailwindPadding} text-[#${cleanHexLabelColor}]`;

      // Border styling
      if (borderWidth !== null && borderWidth > 0) {
        const cleanBorderColor = borderColor.replace("#", "");
        classes += ` border border-[#${cleanBorderColor}] border-[${borderWidth}px]`;
      }

      // Dynamic styling classes
      if (hoverTextColor !== "#FFFFFF") {
        const cleanHoverTextColor = hoverTextColor.replace("#", "");
        classes += ` hover:text-[#${cleanHoverTextColor}]`;
      }

      if (hoverBgColor !== "#404040") {
        const cleanHoverBgColor = hoverBgColor.replace("#", "");
        classes += ` hover:bg-[#${cleanHoverBgColor}]`;
      }

      if (hoverBorderColor) {
        const cleanHoverBorderColor = hoverBorderColor.replace("#", "");
        classes += ` hover:border-[#${cleanHoverBorderColor}] hover:border`;
      }

      if (focusBorderColor !== "#3B82F6") {
        const cleanFocusBorderColor = focusBorderColor.replace("#", "");
        classes += ` focus:border-[#${cleanFocusBorderColor}] focus:border`;
      }

      if (focusRingSize !== null && focusRingSize !== 2) {
        classes += ` focus:outline-none focus:ring-${focusRingSize}`;
      }

      if (activeScale !== null && activeScale !== 95) {
        classes += ` active:scale-[${activeScale / 100}]`;
      }

      if (activeBgColor !== "#525252") {
        const cleanActiveBgColor = activeBgColor.replace("#", "");
        classes += ` active:bg-[#${cleanActiveBgColor}]`;
      }

      if (activeShadowSize !== null && activeShadowSize !== 4) {
        classes += ` active:shadow-${activeShadowSize}`;
      }

      if (transitionType !== "none") {
        const duration = getTransitionDuration(transitionType);
        classes += ` transition-all duration-[${duration}ms] ease-in-out`;
      }

      if (transitionDelay !== null && transitionDelay !== 0) {
        classes += ` delay-[${transitionDelay}ms]`;
      }

      if (hoverScaleType !== "none") {
        const scaleValue = getHoverScaleValue(hoverScaleType);
        classes += ` hover:scale-[${scaleValue / 100}]`;
      }

      if (hoverOpacity !== null && hoverOpacity !== 90) {
        classes += ` hover:opacity-[${hoverOpacity}]`;
      }

      if (hoverScale !== null && hoverScale !== 105) {
        classes += ` hover:scale-[${hoverScale / 100}]`;
      }

      if (hoverTranslateX !== null && hoverTranslateX !== 0) {
        classes += ` hover:translate-x-[${hoverTranslateX}px]`;
      }

      if (hoverRotate !== null && hoverRotate !== 0) {
        classes += ` hover:rotate-[${hoverRotate}deg]`;
      }

      const htmltailwind = `<button class="${classes}">${label}</button>`;
      setHtmltailwind(htmltailwind);
      return { htmltailwind };
    },
    [
      color,
      label,
      borderRadius,
      fontSize,
      padding,
      labelColor,
      borderWidth,
      borderColor,
      hoverTextColor,
      hoverBgColor,
      hoverBorderColor,
      focusBorderColor,
      focusRingSize,
      activeScale,
      activeBgColor,
      activeShadowSize,
      transitionType,
      transitionEasing,
      transitionDelay,
      hoverScaleType,
      hoverOpacity,
      hoverScale,
      hoverTranslateX,
      hoverRotate,
    ]
  );

  const handleCreateButtonClick = useCallback(() => {
    if (borderRadius !== null && fontSize !== null) {
      const hexColor = cleanHexColor(color);
      const hexLabelColor = cleanHexColor(labelColor);
      console.log(`Creating button with color: ${hexColor}, labelColor: ${hexLabelColor}`);
      const { htmltailwind } = generateCode(hexColor, label, borderRadius, fontSize, padding, hexLabelColor);
      emit<CreateButtonHandler>(
        "CREATE_BUTTON",
        hexColor,
        label,
        borderRadius,
        fontSize,
        padding,
        hexLabelColor,
        htmltailwind,
        borderWidth || undefined,
        borderColor,
        hoverTextColor,
        hoverBgColor,
        hoverBorderColor,
        focusBorderColor,
        focusRingSize?.toString() || undefined,
        activeScale?.toString() || undefined,
        activeBgColor,
        activeShadowSize?.toString() || undefined,
        transitionType,
        transitionEasing,
        transitionDelay?.toString() || undefined,
        hoverScaleType,
        hoverOpacity?.toString() || undefined,
        hoverScale?.toString() || undefined,
        hoverTranslateX?.toString() || undefined,
        hoverRotate?.toString() || undefined
      );
    }
  }, [
    color,
    label,
    borderRadius,
    fontSize,
    padding,
    labelColor,
    borderWidth,
    borderColor,
    generateCode,
    hoverTextColor,
    hoverBgColor,
    hoverBorderColor,
    focusBorderColor,
    focusRingSize,
    activeScale,
    activeBgColor,
    activeShadowSize,
    transitionType,
    transitionEasing,
    transitionDelay,
    hoverScaleType,
    hoverOpacity,
    hoverScale,
    hoverTranslateX,
    hoverRotate,
  ]);

  useEffect(() => {
    on<SelectionChangeHandler>("SELECTION_CHANGE", htmltailwind => {
      if (htmltailwind) {
        setHtmltailwind(htmltailwind);
      } else {
        setHtmltailwind("");
      }
    });
  }, []);

  // Tambah state baru untuk Shadow Button, Blur, dan Durasi Skala Hover
  const [shadowButton, setShadowButton] = useState<number | null>(12);
  const [blur, setBlur] = useState<number | null>(2);
  const [hoverScaleDuration, setHoverScaleDuration] = useState<number | null>(300);

  return (
    <div style={{ padding: "32px 24px 24px 24px", fontFamily: "Inter, system-ui, sans-serif", background: "#fff", minHeight: "100vh" }}>
      {/* Judul dan ikon panah */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", marginRight: 8, padding: 0, display: "flex", alignItems: "center" }}>
          {/* Inline SVG dari back.svg */}
          <svg width="15" height="20" viewBox="0 0 20 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.57426 13.7604C1.58095 13.5264 1.62774 13.3125 1.71464 13.1187C1.80155 12.9248 1.93524 12.7376 2.11573 12.5571L12.1629 2.8308C12.4504 2.54335 12.8047 2.39963 13.2258 2.39963C13.5066 2.39963 13.7606 2.46648 13.9879 2.60017C14.2218 2.73387 14.4057 2.91436 14.5394 3.14164C14.6798 3.36892 14.7499 3.62294 14.7499 3.9037C14.7499 4.31816 14.5929 4.68248 14.2787 4.99666L5.19407 13.7504L14.2787 22.5141C14.5929 22.835 14.7499 23.1993 14.7499 23.6071C14.7499 23.8945 14.6798 24.1519 14.5394 24.3792C14.4057 24.6064 14.2218 24.7869 13.9879 24.9206C13.7606 25.061 13.5066 25.1312 13.2258 25.1312C12.8047 25.1312 12.4504 24.9841 12.1629 24.69L2.11573 14.9637C1.92856 14.7832 1.79152 14.596 1.70462 14.4021C1.61771 14.2016 1.57426 13.9877 1.57426 13.7604Z"
              fill="#007AFF"
            />
          </svg>
        </button>
        <Text style={{ fontSize: 28, fontWeight: 600, color: "#222" }}>Button</Text>
      </div>
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Kolom 1: Style Statis */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Style Statis :</Text>
          <VerticalSpace space="small" />
          {/* Lebar Button */}
          <InputField label="Lebar Button (px) :" value={padding.split(",")[0] || ""} onChange={v => setPadding(v + "," + (padding.split(",")[1] || ""))} placeholder="Contoh: 12" />
          {/* Tinggi Button */}
          <InputField label="Tinggi Button (px) :" value={padding.split(",")[1] || ""} onChange={v => setPadding((padding.split(",")[0] || "") + "," + v)} placeholder="Contoh: 6" />
          {/* Label/Text */}
          <InputField label="Label/Text :" value={label} onChange={setLabel} placeholder="Contoh: Submit" />
          {/* Warna Latar */}
          <ColorPicker label="Warna Latar :" value={color} onChange={setColor} />
          {/* Warna Text */}
          <ColorPicker label="Warna Text :" value={labelColor} onChange={setLabelColor} />
          {/* Ukuran Font */}
          <InputField label="Ukuran Font (px) :" value={fontSize !== null ? String(fontSize) : ""} onChange={v => setFontSize(Number(v) || null)} placeholder="Contoh: 16" />
          {/* Padding Sumbu x dan y */}
          <InputField label="Padding Sumbu x dan y (px) :" value={padding} onChange={setPadding} placeholder="Contoh: 24,12" />
          {/* Border Radius */}
          <InputField label="Border Radius (px) :" value={borderRadius !== null ? String(borderRadius) : ""} onChange={v => setBorderRadius(Number(v) || null)} placeholder="Contoh: 2" />
          {/* Border Width */}
          <InputField label="Ketebalan Border (px) :" value={borderWidth !== null ? String(borderWidth) : ""} onChange={v => setBorderWidth(Number(v) || null)} placeholder="Contoh: 1" />
          {/* Warna Border */}
          <ColorPicker label="Warna Border :" value={borderColor} onChange={setBorderColor} />
          {/* Shadow Button */}
          <InputField label="Shadow Button (px) :" value={shadowButton !== null ? String(shadowButton) : ""} onChange={v => setShadowButton(Number(v) || null)} placeholder="Contoh: 12" />
          {/* Blur */}
          <InputField label="Blur (px) :" value={blur !== null ? String(blur) : ""} onChange={v => setBlur(Number(v) || null)} placeholder="Contoh: 2" />
        </div>
        {/* Kolom 2: Style Dinamis */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Style Dinamis :</Text>
          <VerticalSpace space="small" />
          {/* Perubahan warna button */}
          <ColorPicker label="Perubahan warna button :" value={hoverBgColor} onChange={setHoverBgColor} />
          {/* Perubahan warna text */}
          <ColorPicker label="Perubahan warna text :" value={hoverTextColor} onChange={setHoverTextColor} />
          {/* Skala button saat hover (px) */}
          <InputField label="Skala button saat hover (px):" value={hoverScale !== null ? String(hoverScale) : ""} onChange={v => setHoverScale(Number(v) || null)} placeholder="Contoh 105" />
          {/* Durasi skala saat hover */}
          <InputField label="Durasi skala saat hover :" value={hoverScaleDuration !== null ? String(hoverScaleDuration) : ""} onChange={v => setHoverScaleDuration(Number(v) || null)} placeholder="Contoh 300" />
          {/* Skala button saat aktif (px) */}
          <InputField label="Skala button saat aktif (px):" value={activeScale !== null ? String(activeScale) : ""} onChange={v => setActiveScale(Number(v) || null)} placeholder="Contoh 95" />
        </div>
        {/* Kolom 3: Live Preview & Kode */}
        <div
          style={{
            flex: 1,
            minWidth: 320,
            maxWidth: 400,
            position: "sticky",
            top: 24,
            alignSelf: "flex-start",
            zIndex: 2,
          }}
        >
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Preview Komponen :</Text>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, background: "#f8f9fa", minHeight: 180, marginBottom: 24, padding: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {previewHtml ? (
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            ) : (
              <Text>
                <Muted>Preview akan muncul di sini...</Muted>
              </Text>
            )}
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Button fullWidth onClick={() => emit<CloseHandler>("CLOSE")} secondary>
              Tutup
            </Button>
            <Button fullWidth onClick={handleCreateButtonClick}>
              Buat
            </Button>
          </div>
          <Text style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Preview Kode :</Text>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, background: "#f8f9fa", minHeight: 80, padding: 16, fontFamily: "monospace", fontSize: 13, color: "#222", wordBreak: "break-all", position: "relative" }}>
            <Textbox value={htmltailwind} onValueInput={() => {}} style={{ background: "transparent", border: "none", width: "100%", minHeight: 60 }} />
            {/* Tombol copy bisa ditambah di sini jika perlu */}
          </div>
        </div>
      </div>
    </div>
  );
}
