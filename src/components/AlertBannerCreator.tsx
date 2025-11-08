import { Button, Dropdown, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useState, useCallback, useEffect } from "preact/hooks";
import { InputField } from "./ui/InputField";
import { ColorPicker } from "./ui/ColorPicker";

// Komponen untuk preview alert
function AlertPreview({
  alertType,
  title,
  message,
  borderRadius,
  bgColor,
  borderColor,
  borderWidth,
  titleColor,
  titleFontSize,
  messageColor,
  messageFontSize,
  padding,
  iconSize,
  width,
  height,
}: {
  alertType: string;
  title: string;
  message: string;
  borderRadius: string;
  bgColor?: string;
  borderColor?: string;
  borderWidth?: string;
  titleColor?: string;
  titleFontSize?: string;
  messageColor?: string;
  messageFontSize?: string;
  padding?: string;
  iconSize?: string;
  width?: string;
  height?: string;
}) {
  const getDefaultColors = () => {
    switch (alertType) {
      case "information":
        return {
          border: "#BFDBFE",
          bg: "#EFF6FF",
          iconColor: "#2563EB",
          titleColor: "#1E3A8A",
          messageColor: "#1E40AF",
        };
      case "success":
        return {
          border: "#BBF7D0",
          bg: "#F0FDF4",
          iconColor: "#16A34A",
          titleColor: "#14532D",
          messageColor: "#166534",
        };
      case "error":
        return {
          border: "#FECACA",
          bg: "#FEF2F2",
          iconColor: "#DC2626",
          titleColor: "#7F1D1D",
          messageColor: "#991B1B",
        };
      default:
        return {
          border: "#BFDBFE",
          bg: "#EFF6FF",
          iconColor: "#2563EB",
          titleColor: "#1E3A8A",
          messageColor: "#1E40AF",
        };
    }
  };

  const defaultColors = getDefaultColors();
  const colors = {
    border: borderColor || defaultColors.border,
    bg: bgColor || defaultColors.bg,
    iconColor: defaultColors.iconColor,
    titleColor: titleColor || defaultColors.titleColor,
    messageColor: messageColor || defaultColors.messageColor,
  };

  const getIcon = () => {
    const iconSizeValue = iconSize ? `${iconSize}px` : "16px";
    switch (alertType) {
      case "information":
        return (
          <svg style={{ marginTop: "2px", height: iconSizeValue, width: iconSizeValue, color: colors.iconColor }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
      case "success":
        return (
          <svg style={{ marginTop: "2px", height: iconSizeValue, width: iconSizeValue, color: colors.iconColor }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case "error":
        return (
          <svg style={{ marginTop: "2px", height: iconSizeValue, width: iconSizeValue, color: colors.iconColor }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
            <line x1="12" y1="16" x2="12" y2="12"></line>
          </svg>
        );
      default:
        return null;
    }
  };

  const borderRadiusValue = borderRadius ? `${borderRadius}px` : "6px";
  const borderWidthValue = borderWidth ? `${borderWidth}px` : "1px";
  const paddingValue = padding || "16px";
  const titleFontSizeValue = titleFontSize ? `${titleFontSize}px` : "14px";
  const messageFontSizeValue = messageFontSize ? `${messageFontSize}px` : "14px";
  const widthValue = width ? `${width}px` : "auto";
  const heightValue = height ? `${height}px` : "auto";

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        borderRadius: borderRadiusValue,
        border: `${borderWidthValue} solid ${colors.border}`,
        background: colors.bg,
        padding: paddingValue,
        width: widthValue,
        height: heightValue !== "auto" ? heightValue : undefined,
        minHeight: heightValue === "auto" ? undefined : heightValue,
        boxSizing: "border-box", // Include padding dan border dalam width
        overflow: "hidden", // Prevent content overflow
      }}
    >
      {getIcon()}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, minWidth: 0, overflow: "hidden" }}>
        <div style={{ fontWeight: 600, color: colors.titleColor, fontSize: titleFontSizeValue, wordWrap: "break-word", overflowWrap: "break-word" }}>{title}</div>
        <p style={{ fontSize: messageFontSizeValue, color: colors.messageColor, margin: 0, lineHeight: "1.5", wordWrap: "break-word", overflowWrap: "break-word" }}>{message}</p>
      </div>
    </div>
  );
}

export function AlertBannerCreator({ onBack }: { onBack: () => void }) {
  // State untuk Alert Banner - Basic
  const [alertType, setAlertType] = useState("information");
  const [title, setTitle] = useState("Information");
  const [message, setMessage] = useState("This is an informational alert with important details.");
  const [borderRadius, setBorderRadius] = useState("6");

  // State untuk Size & Layout
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [padding, setPadding] = useState("16");
  const [iconSize, setIconSize] = useState("16");

  // State untuk Typography
  const [titleFontSize, setTitleFontSize] = useState("14");
  const [titleColor, setTitleColor] = useState("");
  const [messageFontSize, setMessageFontSize] = useState("14");
  const [messageColor, setMessageColor] = useState("");

  // State untuk Border & Background
  const [borderWidth, setBorderWidth] = useState("1");
  const [borderColor, setBorderColor] = useState("");
  const [bgColor, setBgColor] = useState("");

  // State untuk Style Dinamis
  const [hoverBgColor, setHoverBgColor] = useState("");
  const [hoverBorderColor, setHoverBorderColor] = useState("");
  const [focusRingWidth, setFocusRingWidth] = useState("2");
  const [focusRingColor, setFocusRingColor] = useState("#3B82F6");
  const [transitionType, setTransitionType] = useState("normal");

  const transitionOptions = [
    { value: "none", text: "Tanpa Transisi" },
    { value: "fast", text: "Cepat (150ms)" },
    { value: "normal", text: "Normal (300ms)" },
    { value: "slow", text: "Lambat (500ms)" },
  ];

  const alertTypeOptions = [
    { value: "information", text: "Information" },
    { value: "success", text: "Success" },
    { value: "error", text: "Error" },
  ];

  // Auto-set title and default colors based on alert type (hanya jika belum di-custom)
  useEffect(() => {
    switch (alertType) {
      case "information":
        if (!title || title === "Success" || title === "Error") {
          setTitle("Information");
        }
        if (!bgColor) setBgColor("#EFF6FF");
        if (!borderColor) setBorderColor("#BFDBFE");
        if (!titleColor) setTitleColor("#1E3A8A");
        if (!messageColor) setMessageColor("#1E40AF");
        break;
      case "success":
        if (!title || title === "Information" || title === "Error") {
          setTitle("Success");
        }
        if (!bgColor) setBgColor("#F0FDF4");
        if (!borderColor) setBorderColor("#BBF7D0");
        if (!titleColor) setTitleColor("#14532D");
        if (!messageColor) setMessageColor("#166534");
        break;
      case "error":
        if (!title || title === "Information" || title === "Success") {
          setTitle("Error");
        }
        if (!bgColor) setBgColor("#FEF2F2");
        if (!borderColor) setBorderColor("#FECACA");
        if (!titleColor) setTitleColor("#7F1D1D");
        if (!messageColor) setMessageColor("#991B1B");
        break;
    }
  }, [alertType]);

  // Get colors based on alert type
  const getAlertColors = () => {
    switch (alertType) {
      case "information":
        return {
          border: "border-blue-200",
          bg: "bg-blue-50",
          iconColor: "text-blue-600",
          titleColor: "text-blue-900",
          messageColor: "text-blue-800",
        };
      case "success":
        return {
          border: "border-green-200",
          bg: "bg-green-50",
          iconColor: "text-green-600",
          titleColor: "text-green-900",
          messageColor: "text-green-800",
        };
      case "error":
        return {
          border: "border-red-200",
          bg: "bg-red-50",
          iconColor: "text-red-600",
          titleColor: "text-red-900",
          messageColor: "text-red-800",
        };
      default:
        return {
          border: "border-blue-200",
          bg: "bg-blue-50",
          iconColor: "text-blue-600",
          titleColor: "text-blue-900",
          messageColor: "text-blue-800",
        };
    }
  };

  // Get icon SVG based on alert type
  const getIconSVG = () => {
    const colors = getAlertColors();
    switch (alertType) {
      case "information":
        return `<svg class="mt-0.5 h-4 w-4 ${colors.iconColor}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="12" y1="16" x2="12" y2="12"></line>
  <line x1="12" y1="8" x2="12.01" y2="8"></line>
</svg>`;
      case "success":
        return `<svg class="mt-0.5 h-4 w-4 ${colors.iconColor}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
  <polyline points="22 4 12 14.01 9 11.01"></polyline>
</svg>`;
      case "error":
        return `<svg class="mt-0.5 h-4 w-4 ${colors.iconColor}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="12" y1="8" x2="12.01" y2="8"></line>
  <line x1="12" y1="16" x2="12" y2="12"></line>
</svg>`;
      default:
        return `<svg class="mt-0.5 h-4 w-4 ${colors.iconColor}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="12" y1="16" x2="12" y2="12"></line>
  <line x1="12" y1="8" x2="12.01" y2="8"></line>
</svg>`;
    }
  };

  const [htmltailwind, setHtmltailwind] = useState("");

  // Generate Tailwind code
  const generateCode = useCallback(() => {
    const defaultColors = getAlertColors();
    const iconSVG = getIconSVG();
    const roundedClass = borderRadius ? `rounded-[${borderRadius}px]` : "rounded-md";

    // Use custom colors or defaults
    const bgClass = bgColor ? `bg-[${bgColor}]` : defaultColors.bg;
    const borderClass = borderColor ? `border-[${borderColor}]` : defaultColors.border;
    const borderWidthClass = borderWidth ? `border-[${borderWidth}px]` : "border";
    const titleColorClass = titleColor ? `text-[${titleColor}]` : defaultColors.titleColor;
    const messageColorClass = messageColor ? `text-[${messageColor}]` : defaultColors.messageColor;
    const titleFontSizeClass = titleFontSize ? `text-[${titleFontSize}px]` : "text-sm";
    const messageFontSizeClass = messageFontSize ? `text-[${messageFontSize}px]` : "text-sm";
    const paddingClass = padding ? `p-[${padding}px]` : "p-4";
    const widthClass = width ? `w-[${width}px]` : "";
    const heightClass = height ? `h-[${height}px]` : "";
    const iconSizeClass = iconSize ? `h-[${iconSize}px] w-[${iconSize}px]` : "h-4 w-4";

    // Dynamic styles
    const transitionClass = transitionType !== "none" ? ` transition-all duration-[${transitionType === "fast" ? 150 : transitionType === "slow" ? 500 : 300}ms]` : "";
    const hoverClasses = hoverBgColor || hoverBorderColor ? ` hover:bg-[${hoverBgColor || bgColor}] hover:border-[${hoverBorderColor || borderColor}]` : "";
    const focusClasses = focusRingWidth && focusRingColor ? ` focus:outline focus:outline-[${focusRingWidth}px] focus:outline-[${focusRingColor}]` : "";

    const html = `<div role="alert" class="flex items-start gap-3 ${roundedClass} ${borderWidthClass} ${borderClass} ${bgClass} ${paddingClass} ${widthClass} ${heightClass}${transitionClass}${hoverClasses}${focusClasses}">
  <svg class="mt-0.5 ${iconSizeClass} ${defaultColors.iconColor}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Icon SVG akan di-render sesuai alert type -->
  </svg>
  <div class="space-y-1">
    <div class="font-semibold ${titleFontSizeClass} ${titleColorClass}">${title}</div>
    <p class="${messageFontSizeClass} ${messageColorClass}">
      ${message}
    </p>
  </div>
</div>`;
    setHtmltailwind(html);
    return html;
  }, [
    alertType,
    title,
    message,
    borderRadius,
    bgColor,
    borderColor,
    borderWidth,
    titleColor,
    titleFontSize,
    messageColor,
    messageFontSize,
    padding,
    width,
    height,
    iconSize,
    hoverBgColor,
    hoverBorderColor,
    focusRingWidth,
    focusRingColor,
    transitionType,
  ]);

  useEffect(() => {
    generateCode();
  }, [generateCode]);

  // Emit ke Figma
  const handleCreateAlertBanner = () => {
    emit("CREATE_ALERT_BANNER", {
      alertType,
      title,
      message,
      borderRadius,
      width,
      height,
      padding,
      iconSize,
      titleFontSize,
      titleColor,
      messageFontSize,
      messageColor,
      borderWidth,
      borderColor,
      bgColor,
      hoverBgColor,
      hoverBorderColor,
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
        <Text style={{ fontSize: 28, fontWeight: 600, color: "#222" }}>Alert Banner</Text>
      </div>
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Kolom 1: Style */}
        <div style={{ flex: 1, minWidth: 260, maxHeight: "calc(100vh - 120px)", overflowY: "auto", paddingRight: 8 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Pengaturan :</Text>
          <VerticalSpace space="small" />

          {/* Basic Settings */}
          <Text style={{ fontWeight: 600, fontSize: 16, marginBottom: 12, marginTop: 8, color: "#111827" }}>Dasar :</Text>
          <div style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, color: "#374151" }}>Jenis Alert :</Text>
            <Dropdown options={alertTypeOptions} value={alertType} onValueChange={setAlertType} />
          </div>
          <InputField label="Judul Alert :" value={title} onChange={setTitle} placeholder="Contoh: Information" />
          <InputField label="Pesan Alert :" value={message} onChange={setMessage} placeholder="Contoh: This is an informational alert with important details." />

          {/* Size & Layout */}
          <Text style={{ fontWeight: 600, fontSize: 16, marginBottom: 12, marginTop: 16, color: "#111827" }}>Ukuran & Layout :</Text>
          <InputField label="Lebar (px) :" value={width} onChange={setWidth} placeholder="Kosongkan untuk auto" />
          <InputField label="Tinggi (px) :" value={height} onChange={setHeight} placeholder="Kosongkan untuk auto" />
          <InputField label="Padding (px) :" value={padding} onChange={setPadding} placeholder="Contoh: 16" />
          <InputField label="Icon Size (px) :" value={iconSize} onChange={setIconSize} placeholder="Contoh: 16" />

          {/* Typography */}
          <Text style={{ fontWeight: 600, fontSize: 16, marginBottom: 12, marginTop: 16, color: "#111827" }}>Typography :</Text>
          <InputField label="Ukuran Font Judul (px) :" value={titleFontSize} onChange={setTitleFontSize} placeholder="Contoh: 14" />
          <ColorPicker label="Warna Judul :" value={titleColor || "#1E3A8A"} onChange={setTitleColor} />
          <InputField label="Ukuran Font Pesan (px) :" value={messageFontSize} onChange={setMessageFontSize} placeholder="Contoh: 14" />
          <ColorPicker label="Warna Pesan :" value={messageColor || "#1E40AF"} onChange={setMessageColor} />

          {/* Border & Background */}
          <Text style={{ fontWeight: 600, fontSize: 16, marginBottom: 12, marginTop: 16, color: "#111827" }}>Border & Background :</Text>
          <InputField label="Border Radius (px) :" value={borderRadius} onChange={setBorderRadius} placeholder="Contoh: 6" />
          <InputField label="Border Width (px) :" value={borderWidth} onChange={setBorderWidth} placeholder="Contoh: 1" />
          <ColorPicker label="Warna Border :" value={borderColor || "#BFDBFE"} onChange={setBorderColor} />
          <ColorPicker label="Warna Background :" value={bgColor || "#EFF6FF"} onChange={setBgColor} />

          {/* Style Dinamis */}
          <Text style={{ fontWeight: 600, fontSize: 16, marginBottom: 12, marginTop: 16, color: "#111827" }}>Style Dinamis :</Text>
          <ColorPicker label="Hover Background :" value={hoverBgColor} onChange={setHoverBgColor} />
          <ColorPicker label="Hover Border :" value={hoverBorderColor} onChange={setHoverBorderColor} />
          <InputField label="Focus Ring Width (px) :" value={focusRingWidth} onChange={setFocusRingWidth} placeholder="Contoh: 2" />
          <ColorPicker label="Focus Ring Color :" value={focusRingColor} onChange={setFocusRingColor} />
          <div style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, color: "#374151" }}>Tipe Transisi :</Text>
            <Dropdown options={transitionOptions} value={transitionType} onValueChange={setTransitionType} />
          </div>
        </div>

        {/* Kolom 2: Live Preview & Kode */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 500, position: "sticky", top: 24, alignSelf: "flex-start", zIndex: 2 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Live Preview :</Text>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, background: "#f8f9fa", minHeight: 120, marginBottom: 24, padding: 24, overflow: "auto", display: "flex", justifyContent: "flex-start", alignItems: "flex-start" }}>
            <div style={{ width: "fit-content", maxWidth: "100%" }}>
              <AlertPreview
                alertType={alertType}
                title={title}
                message={message}
                borderRadius={borderRadius}
                bgColor={bgColor}
                borderColor={borderColor}
                borderWidth={borderWidth}
                titleColor={titleColor}
                titleFontSize={titleFontSize}
                messageColor={messageColor}
                messageFontSize={messageFontSize}
                padding={padding}
                iconSize={iconSize}
                width={width}
                height={height}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Button fullWidth secondary onClick={onBack}>
              Tutup
            </Button>
            <Button fullWidth onClick={handleCreateAlertBanner}>
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
