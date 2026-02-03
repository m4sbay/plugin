import { Button, IconClose16, IconDev16, IconInfo16, IconWand16, Muted, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import "../style.css";
import { CloseHandler, CreateButtonHandler, SelectionChangeHandler } from "../types/types";
import { InputField } from "./ui/InputField";
import { ColorPicker } from "./ui/ColorPicker";
import { Prism as SyntaxHighlighterComponent } from "react-syntax-highlighter";
// Gunakan casting 'as any' untuk menghindari error JSX
const SyntaxHighlighter = SyntaxHighlighterComponent as any;
import { shadesOfPurple, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { formatHTML } from "../utils/htmlFormatter";

type ButtonCreatorProps = {
  onBack: () => void;
  isDark?: boolean;
};

export function ButtonCreator({ onBack, isDark = false }: ButtonCreatorProps) {
  const theme = {
    background: isDark ? "#0B1120" : "#FFFFFF",
    primaryText: isDark ? "#F8FAFC" : "#222222",
    secondaryText: isDark ? "#94A3B8" : "#444444",
    accent: isDark ? "#60A5FA" : "#007AFF",
    surface: isDark ? "#111827" : "#FFFFFF",
    surfaceBorder: isDark ? "rgba(255, 255, 255, 0.08)" : "#e5e7eb",
    previewBackground: isDark ? "#1E293B" : "#f8f9fa",
    previewBorder: isDark ? "rgba(148, 163, 184, 0.3)" : "#e5e7eb",
    codeBackground: isDark ? "#0F172A" : "#f8f9fa",
    codeText: isDark ? "#E2E8F0" : "#222222",
  };
  // --- Style Statis (urutan sesuai input di UI Kolom 1) ---
  const [label, setLabel] = useState("Tombol");
  const [color, setColor] = useState("#00BCFF");
  const [labelColor, setLabelColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState<number | null>(16);
  const [fontWeight, setFontWeight] = useState("200");
  const [padding, setPadding] = useState("24,12");
  const [borderRadius, setBorderRadius] = useState<number | null>(8);
  const [borderWidth, setBorderWidth] = useState<number | null>(0);
  const [borderColor, setBorderColor] = useState("");

  // --- Style Dinamis (urutan sesuai input di UI Kolom 2) ---
  const [hoverBgColor, setHoverBgColor] = useState("#404040");
  const [hoverTextColor, setHoverTextColor] = useState("#FFFFFF");
  const [hoverScale, setHoverScale] = useState<number | null>(105);
  const [hoverScaleDuration, setHoverScaleDuration] = useState<number | null>(300);

  // --- Default (tidak ada input di UI, ter-generate otomatis) ---
  const [hoverBorderColor, setHoverBorderColor] = useState("");
  const [focusBorderColor, setFocusBorderColor] = useState("#3B82F6");
  const [focusRingSize, setFocusRingSize] = useState<number | null>(2);
  const [activeBgColor, setActiveBgColor] = useState("#525252");
  const [activeShadowSize, setActiveShadowSize] = useState<number | null>(4);
  const [transitionDelay, setTransitionDelay] = useState<number | null>(0);
  const [transitionType, setTransitionType] = useState("normal");
  const [hoverScaleType, setHoverScaleType] = useState("none");
  const [hoverOpacity, setHoverOpacity] = useState<number | null>(90);
  const [hoverTranslateX, setHoverTranslateX] = useState<number | null>(0);
  const [hoverRotate, setHoverRotate] = useState<number | null>(0);

  // --- UI state (bukan properti komponen) ---
  const [showPaddingTooltip, setShowPaddingTooltip] = useState(false);
  const [htmltailwind, setHtmltailwind] = useState("");
  const [isPreviewHovered, setIsPreviewHovered] = useState(false);

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
      return "#000000";
    }
    return cleaned;
  };

  // Objek style untuk panel Live Preview (komponen React, tanpa dangerouslySetInnerHTML)
  const previewStyles = useMemo(() => {
    const defaultBorderRadius = borderRadius !== null ? borderRadius : 8;
    const defaultFontSize = fontSize !== null ? fontSize : 16;
    const defaultColor = color || "#171717";
    const defaultLabelColor = labelColor || "#FFFFFF";
    const defaultBorderWidth = borderWidth !== null ? borderWidth : 0;
    const defaultBorderColor = borderColor || "#000000";

    const cleanHex = (hex: string): string => {
      if (!hex || hex.trim() === "") return "";
      let cleaned = hex.trim().toUpperCase();
      if (!cleaned.startsWith("#")) cleaned = `#${cleaned}`;
      if (cleaned.length === 4) cleaned = `#${cleaned[1]}${cleaned[1]}${cleaned[2]}${cleaned[2]}${cleaned[3]}${cleaned[3]}`;
      return /^#[0-9A-F]{6}$/.test(cleaned) ? cleaned : "";
    };

    let paddingStyle = "10px";
    let widthStyle: "100%" | "auto" = "auto";
    if (padding) {
      const parts = padding
        .split(",")
        .map(val => val.trim())
        .filter(val => val !== "");
      const values = parts.map(val => parseInt(val, 10)).filter(val => !isNaN(val));
      if (values.length === 1) {
        if (values[0] === 100) {
          widthStyle = "100%";
          paddingStyle = "10px";
        } else {
          paddingStyle = `${values[0]}px`;
        }
      } else if (values.length === 2) {
        if (values[0] === 100) {
          widthStyle = "100%";
          paddingStyle = `${values[1]}px`;
        } else {
          paddingStyle = `${values[1]}px ${values[0]}px`;
        }
      }
    }

    const hasHoverTransform = hoverScale !== null || hoverScaleType !== "none" || (hoverTranslateX !== null && hoverTranslateX !== 0) || (hoverRotate !== null && hoverRotate !== 0);

    let transitionString = "none";
    if (transitionType !== "none" || (hasHoverTransform && hoverScaleDuration !== null)) {
      const transitions: string[] = [];
      if (transitionType !== "none") {
        const baseDuration = getTransitionDuration(transitionType);
        if (hasHoverTransform && hoverScaleDuration !== null) {
          transitions.push(`transform ${hoverScaleDuration}ms ease-in-out`);
          transitions.push(`background-color ${baseDuration}ms ease-in-out`);
          transitions.push(`color ${baseDuration}ms ease-in-out`);
          transitions.push(`border-color ${baseDuration}ms ease-in-out`);
          transitions.push(`opacity ${baseDuration}ms ease-in-out`);
        } else {
          transitions.push(`all ${baseDuration}ms ease-in-out`);
        }
      } else if (hasHoverTransform && hoverScaleDuration !== null) {
        transitions.push(`transform ${hoverScaleDuration}ms ease-in-out`);
      }
      transitionString = transitions.length > 0 ? transitions.join(", ") : "none";
    }

    const defaultFontWeight = fontWeight || "400";
    const baseStyles: Record<string, string | number> = {
      backgroundColor: cleanHexColor(defaultColor),
      color: cleanHexColor(defaultLabelColor),
      borderRadius: `${defaultBorderRadius}px`,
      fontSize: `${defaultFontSize}px`,
      fontWeight: Number(defaultFontWeight) || 400,
      padding: paddingStyle,
      border: defaultBorderWidth > 0 ? `${defaultBorderWidth}px solid ${defaultBorderColor ? cleanHexColor(defaultBorderColor) : "#000000"}` : "none",
      fontFamily: "Inter, system-ui, sans-serif",
      cursor: "pointer",
      transition: transitionString,
      display: widthStyle === "100%" ? "flex" : "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      outline: "none",
    };
    if (widthStyle === "100%") {
      baseStyles.width = "100%";
    }

    const hoverStyles: Record<string, string | number> = {};
    const hoverBg = cleanHex(hoverBgColor);
    if (hoverBg) hoverStyles.backgroundColor = hoverBg;
    const hoverText = cleanHex(hoverTextColor);
    if (hoverText) hoverStyles.color = hoverText;
    if (defaultBorderWidth > 0) {
      const hoverBorder = cleanHex(hoverBorderColor);
      if (hoverBorder) hoverStyles.borderColor = hoverBorder;
    }
    if (hoverOpacity !== null && hoverOpacity !== 100) {
      hoverStyles.opacity = hoverOpacity / 100;
    }
    const transformParts: string[] = [];
    if (hoverScale !== null || hoverScaleType !== "none") {
      const scaleValue = hoverScale !== null ? hoverScale : getHoverScaleValue(hoverScaleType);
      transformParts.push(`scale(${scaleValue / 100})`);
    }
    if (hoverTranslateX !== null && hoverTranslateX !== 0) {
      transformParts.push(`translateX(${hoverTranslateX}px)`);
    }
    if (hoverRotate !== null && hoverRotate !== 0) {
      transformParts.push(`rotate(${hoverRotate}deg)`);
    }
    if (transformParts.length > 0) {
      hoverStyles.transform = transformParts.join(" ");
    }

    return { paddingStyle, widthStyle, baseStyles, hoverStyles };
  }, [
    color,
    label,
    borderRadius,
    fontSize,
    fontWeight,
    padding,
    labelColor,
    borderWidth,
    borderColor,
    hoverTextColor,
    hoverBgColor,
    hoverBorderColor,
    focusBorderColor,
    focusRingSize,
    activeBgColor,
    activeShadowSize,
    transitionType,
    transitionDelay,
    hoverScaleType,
    hoverOpacity,
    hoverScale,
    hoverScaleDuration,
    hoverTranslateX,
    hoverRotate,
  ]);

  // Raw HTML string untuk panel kode (format async di useEffect)
  const htmlCode = useMemo(() => {
    const defaultHexColor = color ? cleanHexColor(color) : "#171717";
    const defaultLabel = label || "Tombol";
    const defaultBorderRadius = borderRadius !== null ? borderRadius : 8;
    const defaultFontSize = fontSize !== null ? fontSize : 16;
    const defaultHexLabelColor = labelColor ? cleanHexColor(labelColor) : "#FFFFFF";
    const defaultBorderWidth = borderWidth !== null ? borderWidth : 0;
    const defaultBorderColor = borderColor || "#000000";

    let tailwindPadding = "p-[10px]"; // default
    let tailwindWidth = ""; // untuk w-full jika sumbu x = 100
    if (padding) {
      const parts = padding
        .split(",")
        .map(val => val.trim())
        .filter(val => val !== "");
      const values = parts.map(val => parseInt(val, 10)).filter(val => !isNaN(val));

      if (values.length === 1) {
        if (values[0] === 100) {
          tailwindWidth = "w-full";
          tailwindPadding = "p-[10px]";
        } else {
          tailwindPadding = `p-[${values[0]}px]`;
        }
      } else if (values.length === 2) {
        if (values[0] === 100) {
          tailwindWidth = "w-full";
          tailwindPadding = `py-[${values[1]}px]`;
        } else {
          tailwindPadding = `py-[${values[1]}px] px-[${values[0]}px]`;
        }
      }
    }

    const cleanHex = defaultHexColor.replace("#", "");
    const cleanHexLabel = defaultHexLabelColor.replace("#", "");

    const defaultFontWeight = fontWeight || "400";
    let classes = `bg-[#${cleanHex}] rounded-[${defaultBorderRadius}px] text-[${defaultFontSize}px] font-[${defaultFontWeight}] ${tailwindWidth ? tailwindWidth + " " : ""}${tailwindPadding} text-[#${cleanHexLabel}] cursor-pointer`;

    if (defaultBorderWidth > 0) {
      const cleanBorderColor = defaultBorderColor.replace("#", "");
      classes += ` border-[#${cleanBorderColor}] border-[${defaultBorderWidth}px]`;
    }

    if (hoverTextColor && hoverTextColor.trim() !== "") {
      const cleanHoverTextColor = hoverTextColor.replace("#", "");
      classes += ` hover:text-[#${cleanHoverTextColor}]`;
    }
    if (hoverBgColor && hoverBgColor.trim() !== "") {
      const cleanHoverBgColor = hoverBgColor.replace("#", "");
      classes += ` hover:bg-[#${cleanHoverBgColor}]`;
    }
    if (hoverBorderColor && hoverBorderColor.trim() !== "") {
      const cleanHoverBorderColor = hoverBorderColor.replace("#", "");
      classes += ` hover:border-[#${cleanHoverBorderColor}]`;
    }
    if (focusBorderColor !== "#3B82F6") {
      const cleanFocusBorderColor = focusBorderColor.replace("#", "");
      classes += ` focus:border-[#${cleanFocusBorderColor}]`;
    }
    if (focusRingSize !== null && focusRingSize !== 2) {
      classes += ` focus:outline-none focus:ring-${focusRingSize}`;
    }
    if (activeBgColor !== "#525252") {
      const cleanActiveBgColor = activeBgColor.replace("#", "");
      classes += ` active:bg-[#${cleanActiveBgColor}]`;
    }
    if (activeShadowSize !== null && activeShadowSize !== 4) {
      classes += ` active:shadow-${activeShadowSize}`;
    }

    let hasHoverScale = false;
    if (hoverScale !== null && hoverScale > 0) {
      classes += ` hover:scale-[${hoverScale / 100}]`;
      hasHoverScale = true;
    } else if (hoverScaleType !== "none") {
      const scaleValue = getHoverScaleValue(hoverScaleType);
      classes += ` hover:scale-[${scaleValue / 100}]`;
      hasHoverScale = true;
    }

    const hasHoverTransform = hasHoverScale || (hoverTranslateX !== null && hoverTranslateX !== 0) || (hoverRotate !== null && hoverRotate !== 0);
    if (hasHoverTransform && hoverScaleDuration !== null && hoverScaleDuration > 0) {
      classes += ` transition-all duration-[${hoverScaleDuration}ms] ease-in-out`;
    } else if (transitionType !== "none") {
      const duration = getTransitionDuration(transitionType);
      classes += ` transition-all duration-[${duration}ms] ease-in-out`;
    }
    if (transitionDelay !== null && transitionDelay !== 0) {
      classes += ` delay-[${transitionDelay}ms]`;
    }
    if (hoverOpacity !== null && hoverOpacity !== 90) {
      classes += ` hover:opacity-[${hoverOpacity}]`;
    }
    if (hoverTranslateX !== null && hoverTranslateX !== 0) {
      classes += ` hover:translate-x-[${hoverTranslateX}px]`;
    }
    if (hoverRotate !== null && hoverRotate !== 0) {
      classes += ` hover:rotate-[${hoverRotate}deg]`;
    }

    return `<button class="${classes}">${defaultLabel}</button>`;
  }, [
    color,
    label,
    borderRadius,
    fontSize,
    fontWeight,
    padding,
    labelColor,
    borderWidth,
    borderColor,
    hoverTextColor,
    hoverBgColor,
    hoverBorderColor,
    focusBorderColor,
    focusRingSize,
    activeBgColor,
    activeShadowSize,
    transitionType,
    transitionDelay,
    hoverScaleType,
    hoverOpacity,
    hoverScale,
    hoverScaleDuration,
    hoverTranslateX,
    hoverRotate,
  ]);

  useEffect(() => {
    (async () => {
      const formattedHtml = await formatHTML(htmlCode);
      setHtmltailwind(formattedHtml);
    })();
  }, [htmlCode]);

  const handleCreateButtonClick = useCallback(() => {
    const hexColor = color ? cleanHexColor(color) : "#171717";
    const hexLabelColor = labelColor ? cleanHexColor(labelColor) : "#FFFFFF";
    const finalBorderRadius = borderRadius !== null ? borderRadius : 8;
    const finalFontSize = fontSize !== null ? fontSize : 16;
    const finalLabel = label || "Tombol";
    console.log(`Creating button with color: ${hexColor}, labelColor: ${hexLabelColor}`);
    emit<CreateButtonHandler>(
      "CREATE_BUTTON",
      hexColor,
      finalLabel,
      finalBorderRadius,
      finalFontSize,
      fontWeight || "400",
      padding,
      hexLabelColor,
      htmltailwind, // dari state (di-update oleh useEffect saat htmlCode berubah)
      borderWidth || undefined,
      borderColor,
      hoverTextColor,
      hoverBgColor,
      hoverBorderColor,
      focusBorderColor,
      focusRingSize?.toString() || undefined,
      activeBgColor,
      activeShadowSize?.toString() || undefined,
      undefined, // transitionEasing - tidak ada di UI ButtonCreator
      transitionType,
      transitionDelay?.toString() || undefined,
      hoverScaleType,
      hoverOpacity?.toString() || undefined,
      hoverScale?.toString() || undefined,
      hoverScaleDuration?.toString() || undefined,
      hoverTranslateX?.toString() || undefined,
      hoverRotate?.toString() || undefined
    );
  }, [
    color,
    label,
    borderRadius,
    fontSize,
    padding,
    labelColor,
    borderWidth,
    borderColor,
    htmltailwind,
    hoverTextColor,
    hoverBgColor,
    hoverBorderColor,
    focusBorderColor,
    focusRingSize,
    activeBgColor,
    activeShadowSize,
    transitionType,
    transitionDelay,
    hoverScaleType,
    hoverOpacity,
    hoverScale,
    hoverTranslateX,
    hoverRotate,
  ]);

  useEffect(() => {
    on<SelectionChangeHandler>("SELECTION_CHANGE", data => {
      if (data) {
        try {
          // Try to parse as JSON (button data)
          const buttonData = JSON.parse(data);
          if (buttonData.htmltailwind) {
            // Load all button data
            setHtmltailwind(buttonData.htmltailwind);
            if (buttonData.color) setColor(buttonData.color);
            if (buttonData.label) setLabel(buttonData.label);
            if (buttonData.borderRadius) setBorderRadius(Number(buttonData.borderRadius) || null);
            if (buttonData.fontSize) setFontSize(Number(buttonData.fontSize) || null);
            if (buttonData.fontWeight) setFontWeight(buttonData.fontWeight || "400");
            if (buttonData.padding) setPadding(buttonData.padding);
            if (buttonData.labelColor) setLabelColor(buttonData.labelColor);
            if (buttonData.borderWidth) setBorderWidth(Number(buttonData.borderWidth) || null);
            if (buttonData.borderColor) setBorderColor(buttonData.borderColor);
            if (buttonData.hoverTextColor) setHoverTextColor(buttonData.hoverTextColor);
            if (buttonData.hoverBgColor) setHoverBgColor(buttonData.hoverBgColor);
            if (buttonData.hoverBorderColor) setHoverBorderColor(buttonData.hoverBorderColor);
            if (buttonData.focusBorderColor) setFocusBorderColor(buttonData.focusBorderColor);
            if (buttonData.focusRingSize) setFocusRingSize(Number(buttonData.focusRingSize) || null);
            if (buttonData.activeBgColor) setActiveBgColor(buttonData.activeBgColor);
            if (buttonData.activeShadowSize) setActiveShadowSize(Number(buttonData.activeShadowSize) || null);
            if (buttonData.transitionType) setTransitionType(buttonData.transitionType);
            if (buttonData.transitionDelay) setTransitionDelay(Number(buttonData.transitionDelay) || null);
            if (buttonData.hoverScaleType) setHoverScaleType(buttonData.hoverScaleType);
            // Only update state if data exists, is not empty string, and is a valid number
            // For hoverScale and hoverScaleDuration, only update if value is > 0 (0 is not a valid scale/duration)
            if (buttonData.hoverOpacity !== undefined && buttonData.hoverOpacity !== "" && buttonData.hoverOpacity !== null) {
              const opacityValue = Number(buttonData.hoverOpacity);
              if (!isNaN(opacityValue)) setHoverOpacity(opacityValue);
            }
            if (buttonData.hoverScale !== undefined && buttonData.hoverScale !== "" && buttonData.hoverScale !== null) {
              const scaleValue = Number(buttonData.hoverScale);
              if (!isNaN(scaleValue) && scaleValue > 0) setHoverScale(scaleValue);
            }
            if (buttonData.hoverScaleDuration !== undefined && buttonData.hoverScaleDuration !== "" && buttonData.hoverScaleDuration !== null) {
              const durationValue = Number(buttonData.hoverScaleDuration);
              if (!isNaN(durationValue) && durationValue > 0) setHoverScaleDuration(durationValue);
            }
            if (buttonData.hoverTranslateX !== undefined && buttonData.hoverTranslateX !== "" && buttonData.hoverTranslateX !== null) {
              const translateXValue = Number(buttonData.hoverTranslateX);
              if (!isNaN(translateXValue)) setHoverTranslateX(translateXValue);
            }
            if (buttonData.hoverRotate !== undefined && buttonData.hoverRotate !== "" && buttonData.hoverRotate !== null) {
              const rotateValue = Number(buttonData.hoverRotate);
              if (!isNaN(rotateValue)) setHoverRotate(rotateValue);
            }
          }
        } catch (e) {
          // If not JSON, treat as plain htmltailwind string (for other components)
          setHtmltailwind(data);
        }
      } else {
        setHtmltailwind("");
      }
    });
  }, []);

  const [copied, setCopied] = useState(false);

  // Fungsi untuk copy kode ke clipboard
  const handleCopyCode = useCallback(async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(htmltailwind);
      } else {
        // Fallback untuk browser yang tidak support Clipboard API
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
      {/* Judul dan ikon panah */}
      <div style={{ marginBottom: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", marginRight: 8, padding: 0, display: "flex", alignItems: "center" }}>
            <svg width="15" height="20" viewBox="0 0 20 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.57426 13.7604C1.58095 13.5264 1.62774 13.3125 1.71464 13.1187C1.80155 12.9248 1.93524 12.7376 2.11573 12.5571L12.1629 2.8308C12.4504 2.54335 12.8047 2.39963 13.2258 2.39963C13.5066 2.39963 13.7606 2.46648 13.9879 2.60017C14.2218 2.73387 14.4057 2.91436 14.5394 3.14164C14.6798 3.36892 14.7499 3.62294 14.7499 3.9037C14.7499 4.31816 14.5929 4.68248 14.2787 4.99666L5.19407 13.7504L14.2787 22.5141C14.5929 22.835 14.7499 23.1993 14.7499 23.6071C14.7499 23.8945 14.6798 24.1519 14.5394 24.3792C14.4057 24.6064 14.2218 24.7869 13.9879 24.9206C13.7606 25.061 13.5066 25.1312 13.2258 25.1312C12.8047 25.1312 12.4504 24.9841 12.1629 24.69L2.11573 14.9637C1.92856 14.7832 1.79152 14.596 1.70462 14.4021C1.61771 14.2016 1.57426 13.9877 1.57426 13.7604Z"
                fill={theme.accent}
              />
            </svg>
          </button>
          <Text style={{ fontSize: 28, fontWeight: 600, color: theme.primaryText }}>Button</Text>
        </div>
      </div>
      <VerticalSpace space="large" />
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start", paddingTop: 12 }}>
        {/* Kolom 1: Style Statis */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <Text style={{ fontWeight: 600, fontSize: 18 }}>Style Statis :</Text>
          <VerticalSpace space="large" />
          {/* Label/Text */}
          <InputField label="Label/Text :" value={label} onChange={setLabel} placeholder="Contoh: Tombol" />
          {/* Warna Latar */}
          <ColorPicker label="Warna Latar :" value={color} onChange={setColor} />
          {/* Warna Text */}
          <ColorPicker label="Warna Text :" value={labelColor} onChange={setLabelColor} />
          {/* Ukuran Font */}
          <InputField label="Ukuran Font (px) :" value={fontSize !== null ? String(fontSize) : ""} onChange={v => setFontSize(Number(v) || null)} placeholder="Contoh: 16" />
          {/* Font Weight */}
          <InputField label="Font weight :" value={fontWeight} onChange={setFontWeight} placeholder="Contoh: 500 (akan menjadi font-[500])" />
          {/* Padding Sumbu x dan y */}
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Text>
                <Muted>Padding Sumbu x dan y (px) :</Muted>
              </Text>
              <div
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={() => setShowPaddingTooltip(true)}
                onMouseLeave={() => setShowPaddingTooltip(false)}
              >
                <IconInfo16 style={{ cursor: "pointer", color: theme.secondaryText }} />
                {showPaddingTooltip && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      marginBottom: 8,
                      padding: "8px 12px",
                      backgroundColor: theme.previewBackground,
                      color: theme.primaryText,
                      borderRadius: 6,
                      fontSize: 12,
                      whiteSpace: "nowrap",
                      boxShadow: `0 2px 8px rgba(0, 0, 0, ${isDark ? 0.3 : 0.15})`,
                      border: `1px solid ${theme.previewBorder}`,
                      zIndex: 1000,
                      pointerEvents: "none",
                    }}
                  >
                    gunakan padding x = "100" untuk full width
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 0,
                        height: 0,
                        borderLeft: "6px solid transparent",
                        borderRight: "6px solid transparent",
                        borderTop: `6px solid ${theme.previewBackground}`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <VerticalSpace space="small" />
            <Textbox value={padding} onValueInput={setPadding} placeholder="Contoh: 24,12" />
            <VerticalSpace space="large" />
          </div>
          {/* Border Radius */}
          <InputField label="Border Radius (px) :" value={borderRadius !== null ? String(borderRadius) : ""} onChange={v => setBorderRadius(Number(v) || null)} placeholder="Contoh: 8" />
          {/* Border Width */}
          <InputField label="Ketebalan Border (px) :" value={borderWidth !== null ? String(borderWidth) : ""} onChange={v => setBorderWidth(Number(v) || null)} placeholder="Contoh: 2" />
          {/* Warna Border */}
          <ColorPicker label="Warna Border :" value={borderColor} onChange={setBorderColor} />
        </div>
        {/* Kolom 2: Style Dinamis */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <Text style={{ fontWeight: 600, fontSize: 18 }}>Style Dinamis :</Text>
          <VerticalSpace space="large" />
          {/* Perubahan warna button */}
          <ColorPicker label="Perubahan warna button :" value={hoverBgColor} onChange={setHoverBgColor} />
          {/* Perubahan warna text */}
          <ColorPicker label="Perubahan warna text :" value={hoverTextColor} onChange={setHoverTextColor} />
          {/* Skala button saat hover (px) */}
          <InputField
            label="Skala button saat hover (px):"
            value={hoverScale !== null ? String(hoverScale) : ""}
            onChange={v => {
              const numValue = v.trim() === "" ? null : Number(v);
              setHoverScale(isNaN(numValue as number) ? null : numValue);
            }}
            placeholder="Contoh 105"
          />
          {/* Durasi skala saat hover */}
          <InputField
            label="Durasi skala saat hover :"
            value={hoverScaleDuration !== null ? String(hoverScaleDuration) : ""}
            onChange={v => {
              const numValue = v.trim() === "" ? null : Number(v);
              setHoverScaleDuration(isNaN(numValue as number) ? null : numValue);
            }}
            placeholder="Contoh 300"
          />
        </div>
        {/* Kolom 3: Live Preview & Kode */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 400, display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
          <Text style={{ fontWeight: 600, fontSize: 18 }}>Live Preview :</Text>
          <VerticalSpace space="large" />
          <div
            style={{
              border: ` 1px solid ${theme.previewBorder}`,
              borderRadius: 8,
              background: theme.previewBackground,
              flex: 1,
              minHeight: 0,
              padding: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: previewStyles.widthStyle,
                maxWidth: "100%",
                boxSizing: "border-box",
              }}
            >
              <button
                type="button"
                style={{
                  ...previewStyles.baseStyles,
                  ...(isPreviewHovered ? previewStyles.hoverStyles : {}),
                }}
                onMouseEnter={() => setIsPreviewHovered(true)}
                onMouseLeave={() => setIsPreviewHovered(false)}
              >
                {label || "Tombol"}
              </button>
            </div>
          </div>
          <VerticalSpace space="large" />
          <div style={{ display: "flex", gap: 12 }}>
            <Button fullWidth danger onClick={onBack}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <IconClose16 />
                Tutup
              </span>
            </Button>
            <Button fullWidth onClick={handleCreateButtonClick}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <IconWand16 />
                Buat
              </span>
            </Button>
          </div>
          <VerticalSpace space="large" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontWeight: 600, fontSize: 16 }}>Kode :</Text>
          </div>
          <VerticalSpace space="large" />
          <div
            style={{
              border: `1px solid ${theme.surfaceBorder}`,
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
          <VerticalSpace space="large" />
          <Button onClick={handleCopyCode} style={{ padding: "4px 12px", fontSize: 12, height: "auto" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <IconDev16 />
              {copied ? "Tersalin!" : "Copy"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

