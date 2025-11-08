import { Button, Dropdown, Muted, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useState, useCallback, useEffect } from "preact/hooks";
import { InputField } from "./ui/InputField";
import { ColorPicker } from "./ui/ColorPicker";

export function TextFieldCreator({ onBack }: { onBack: () => void }) {
  // State Style Statis
  const [label, setLabel] = useState("");
  const [labelColor, setLabelColor] = useState("#222222");
  const [fontSize, setFontSize] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [borderRadius, setBorderRadius] = useState("");
  const [outlineWidth, setOutlineWidth] = useState("");
  const [outlineColor, setOutlineColor] = useState("#D1D5DB");
  const [padding, setPadding] = useState("");
  const [shadow, setShadow] = useState("");
  const [labelGap, setLabelGap] = useState("8"); // Jarak antara label dan input

  // State Style Dinamis
  const [hoverBgColor, setHoverBgColor] = useState("#E5E7EB");
  const [activeRingWidth, setActiveRingWidth] = useState("");
  const [ringColor, setRingColor] = useState("#007AFF");

  // Transisi
  const [transitionType, setTransitionType] = useState("normal");
  const transitionOptions = [
    { value: "none", text: "Tanpa Transisi" },
    { value: "fast", text: "Cepat (150ms)" },
    { value: "normal", text: "Normal (300ms)" },
    { value: "slow", text: "Lambat (500ms)" },
  ];

  const [htmltailwind, setHtmltailwind] = useState("");

  // Generate Tailwind class (arbitrary value)
  const generateCode = useCallback(() => {
    // Input classes
    let inputClasses = "";
    if (width) {
      // Parse width, remove 'px' jika ada
      const widthValue = width.replace(/px/gi, "").trim();
      inputClasses += ` w-[${widthValue}px]`;
    }
    if (height) {
      // Parse height, remove 'px' jika ada
      const heightValue = height.replace(/px/gi, "").trim();
      inputClasses += ` h-[${heightValue}px]`;
    }
    if (bgColor) inputClasses += ` bg-[${bgColor}]`;
    if (fontSize) {
      // Parse fontSize, remove 'px' jika ada
      const fontSizeValue = fontSize.replace(/px/gi, "").trim();
      inputClasses += ` text-[${fontSizeValue}px]`;
    }

    // Parse padding untuk input
    if (padding) {
      const paddingValues = padding.split(",").map((val: string) => val.trim().replace(/px/gi, ""));
      if (paddingValues.length === 1) {
        inputClasses += ` p-[${paddingValues[0]}px]`;
      } else if (paddingValues.length === 2) {
        inputClasses += ` px-[${paddingValues[0]}px] py-[${paddingValues[1]}px]`;
      }
    }

    if (borderRadius) {
      const borderRadiusValue = borderRadius.replace(/px/gi, "").trim();
      inputClasses += ` rounded-[${borderRadiusValue}px]`;
    }

    // Outline/Border menggunakan border di Tailwind
    if (outlineWidth && Number(outlineWidth) > 0) {
      const outlineWidthValue = outlineWidth.replace(/px/gi, "").trim();
      // Tailwind arbitrary value untuk border width menggunakan format border-[width]
      inputClasses += ` border-[${outlineWidthValue}px]`;
      if (outlineColor) {
        // Border color dengan arbitrary value
        inputClasses += ` border-[${outlineColor}]`;
      }
    } else {
      inputClasses += ` border-0`;
    }

    // Shadow dengan arbitrary value
    if (shadow) {
      // Parse shadow format seperti "0_2px_12px_rgba(0,0,0,0.08)" menjadi format Tailwind
      // Ganti spasi dengan underscore untuk format Tailwind arbitrary value
      const shadowFormatted = shadow.replace(/\s+/g, "_");
      inputClasses += ` shadow-[${shadowFormatted}]`;
    }

    // Dinamis
    if (hoverBgColor) inputClasses += ` hover:bg-[${hoverBgColor}]`;
    if (activeRingWidth && ringColor) {
      const ringWidthValue = activeRingWidth.replace(/px/gi, "").trim();
      inputClasses += ` focus:ring-[${ringWidthValue}px] focus:ring-[${ringColor}] focus:outline-none`;
    }

    // Transisi
    if (transitionType !== "none") {
      const duration = transitionType === "fast" ? 150 : transitionType === "slow" ? 500 : 300;
      inputClasses += ` transition-all duration-[${duration}ms]`;
    }

    // Tambahkan text-center untuk placeholder center
    inputClasses += ` text-center`;

    // Label classes
    let labelClasses = "block";
    // Tambahkan margin bottom dengan gap dari user
    if (labelGap) {
      const gapValue = labelGap.replace(/px/gi, "").trim();
      labelClasses += ` mb-[${gapValue}px]`;
    } else {
      labelClasses += ` mb-2`;
    }
    if (labelColor) labelClasses += ` text-[${labelColor}]`;
    if (fontSize) {
      const fontSizeValue = fontSize.replace(/px/gi, "").trim();
      labelClasses += ` text-[${fontSizeValue}px]`;
    }

    // HTML - label dan input terpisah
    let html = "";
    if (label) {
      html += `<label class="${labelClasses.trim()}">${label}</label>`;
    }
    html += `<input type="text" placeholder="${placeholder}" class="${inputClasses.trim()}" />`;

    setHtmltailwind(html);
    return html;
  }, [label, labelColor, fontSize, placeholder, width, height, bgColor, borderRadius, outlineWidth, outlineColor, padding, shadow, hoverBgColor, activeRingWidth, ringColor, transitionType, labelGap]);

  useEffect(() => {
    generateCode();
  }, [generateCode]);

  // Emit ke Figma saat klik Buat
  const handleCreateTextField = () => {
    emit("CREATE_TEXT_FIELD", {
      label,
      labelColor,
      fontSize,
      placeholder,
      width,
      height,
      bgColor,
      borderRadius,
      outlineWidth,
      outlineColor,
      padding,
      shadow,
      hoverBgColor,
      activeRingWidth,
      ringColor,
      transitionType,
      labelGap,
      htmltailwind,
    });
  };

  // Preview style
  const previewStyle = {
    width: width || undefined,
    height: height || undefined,
    background: bgColor,
    color: labelColor,
    fontSize: fontSize || undefined,
    padding: padding || undefined,
    borderRadius: borderRadius || undefined,
    outlineWidth: outlineWidth || undefined,
    outlineColor: outlineColor || undefined,
    boxShadow: shadow ? shadow : undefined,
    border: "none",
    transition: transitionType === "none" ? "none" : `all ${transitionType === "fast" ? 150 : transitionType === "slow" ? 500 : 300}ms ease-in-out`,
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
        <Text style={{ fontSize: 28, fontWeight: 600, color: "#222" }}>Text Field</Text>
      </div>
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Kolom 1: Style Statis */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Style Statis :</Text>
          <VerticalSpace space="small" />
          <InputField label="Label Input :" value={label} onChange={setLabel} placeholder="Contoh: Nama Lengkap" />
          <ColorPicker label="Warna label :" value={labelColor} onChange={setLabelColor} />
          <InputField label="Ukuran teks label (px):" value={fontSize} onChange={setFontSize} placeholder="Contoh: 16" />
          <InputField label="Jarak label dengan input (px) :" value={labelGap} onChange={setLabelGap} placeholder="Contoh: 8" />
          <InputField label="Placeholder :" value={placeholder} onChange={setPlaceholder} placeholder="Contoh: Isi Dengan Nama Lengkap" />
          <InputField label="Lebar input (px) :" value={width} onChange={setWidth} placeholder="Contoh: 200px" />
          <InputField label="Tinggi input (px) :" value={height} onChange={setHeight} placeholder="Contoh: 40px" />
          <ColorPicker label="Warna Latar :" value={bgColor} onChange={setBgColor} />
          <InputField label="Border radius (px) :" value={borderRadius} onChange={setBorderRadius} placeholder="Contoh: 4" />
          <InputField label="Outline input (px) :" value={outlineWidth} onChange={setOutlineWidth} placeholder="Contoh: 2" />
          <ColorPicker label="Warna outline :" value={outlineColor} onChange={setOutlineColor} />
          <InputField label="Padding sumbu x dan y (px) :" value={padding} onChange={setPadding} placeholder="Contoh: 24px,12px" />
          <InputField label="Shadow input :" value={shadow} onChange={setShadow} placeholder="Contoh: 0_2px_12px_rgba(0,0,0,0.08)" />
        </div>
        {/* Kolom 2: Style Dinamis */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Style Dinamis :</Text>
          <VerticalSpace space="small" />
          <ColorPicker label="Warna input saat hover :" value={hoverBgColor} onChange={setHoverBgColor} />
          <InputField label="Ketebalan ring saat aktif (px) :" value={activeRingWidth} onChange={setActiveRingWidth} placeholder="Contoh: 2" />
          <ColorPicker label="Warna ring :" value={ringColor} onChange={setRingColor} />
          <Dropdown options={transitionOptions} value={transitionType} onValueChange={setTransitionType} />
        </div>
        {/* Kolom 3: Live Preview & Kode */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 400, position: "sticky", top: 24, alignSelf: "flex-start", zIndex: 2 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Live Preview :</Text>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, background: "#f8f9fa", minHeight: 120, marginBottom: 24, padding: 24 }}>
            <Text style={{ marginBottom: labelGap ? `${labelGap.replace(/px/gi, "")}px` : "8px", color: labelColor, fontSize: fontSize ? fontSize : 16 }}>{label}</Text>
            <input type="text" placeholder={placeholder} style={{ ...previewStyle, textAlign: "center" } as any} />
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Button fullWidth secondary onClick={onBack}>
              Tutup
            </Button>
            <Button fullWidth onClick={handleCreateTextField}>
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
