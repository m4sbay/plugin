import { Button, IconClose16, IconDev16, IconWand16, Muted, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
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
  // Static styling properties - semua kosong, default di-generate di fungsi
  const [color, setColor] = useState("#00BCFF");
  const [label, setLabel] = useState("Tombol");
  const [borderRadius, setBorderRadius] = useState<number | null>(8);
  const [fontSize, setFontSize] = useState<number | null>(16);
  const [fontWeight, setFontWeight] = useState("400");
  const [padding, setPadding] = useState("24,12");
  const [labelColor, setLabelColor] = useState("#FFFFFF");
  const [borderWidth, setBorderWidth] = useState<number | null>(0);
  const [borderColor, setBorderColor] = useState("");

  // Dynamic styling properties
  const [hoverTextColor, setHoverTextColor] = useState("#FFFFFF");
  const [hoverBgColor, setHoverBgColor] = useState("#404040");
  const [hoverBorderColor, setHoverBorderColor] = useState("");
  const [focusBorderColor, setFocusBorderColor] = useState("#3B82F6");
  const [focusRingSize, setFocusRingSize] = useState<number | null>(2);
  const [activeBgColor, setActiveBgColor] = useState("#525252");
  const [activeShadowSize, setActiveShadowSize] = useState<number | null>(4);
  const [transitionDelay, setTransitionDelay] = useState<number | null>(0);
  const [transitionType, setTransitionType] = useState("normal");
  const [hoverScaleType, setHoverScaleType] = useState("none");
  const [hoverOpacity, setHoverOpacity] = useState<number | null>(90);
  const [hoverScale, setHoverScale] = useState<number | null>(105);
  const [hoverTranslateX, setHoverTranslateX] = useState<number | null>(0);
  const [hoverRotate, setHoverRotate] = useState<number | null>(0);
  const [hoverScaleDuration, setHoverScaleDuration] = useState<number | null>(300);

  const [showPaddingTooltip, setShowPaddingTooltip] = useState(false);

  const [htmltailwind, setHtmltailwind] = useState("");

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

  // Convert Tailwind classes to inline styles for preview menggunakan useMemo
  const previewHtml = useMemo(() => {
    // Default values jika input kosong
    const defaultBorderRadius = borderRadius !== null ? borderRadius : 8;
    const defaultFontSize = fontSize !== null ? fontSize : 16;
    const defaultColor = color || "#171717";
    const defaultLabelColor = labelColor || "#FFFFFF";
    const defaultLabel = label || "Tombol";
    const defaultBorderWidth = borderWidth !== null ? borderWidth : 0;
    const defaultBorderColor = borderColor || "#000000";

    const cleanHexColor = defaultColor.replace("#", "");
    const cleanHexLabelColor = defaultLabelColor.replace("#", "");

    // Calculate padding - default 10px jika kosong
    let paddingStyle = "10px";
    let widthStyle = "";
    if (padding) {
      const parts = padding
        .split(",")
        .map(val => val.trim())
        .filter(val => val !== "");
      const values = parts.map(val => parseInt(val, 10)).filter(val => !isNaN(val));

      if (values.length === 1) {
        // Hanya satu nilai (lebar atau tinggi saja)
        if (values[0] === 100) {
          widthStyle = "100%";
          paddingStyle = "10px";
        } else {
          paddingStyle = `${values[0]}px`;
        }
      } else if (values.length === 2) {
        // Dua nilai (sumbu x, sumbu y)
        if (values[0] === 100) {
          // Jika sumbu x = 100, gunakan width 100% dan padding hanya untuk sumbu y
          widthStyle = "100%";
          paddingStyle = `${values[1]}px`;
        } else {
          // Format normal: py px
          paddingStyle = `${values[1]}px ${values[0]}px`;
        }
      }
    }

    // Check if there are transform properties for hover
    const hasHoverTransform = hoverScale !== null || hoverScaleType !== "none" || (hoverTranslateX !== null && hoverTranslateX !== 0) || (hoverRotate !== null && hoverRotate !== 0);

    // Build transition string
    let transitionString = "none";
    if (transitionType !== "none" || (hasHoverTransform && hoverScaleDuration !== null)) {
      const transitions: string[] = [];

      // Transition untuk semua properties (kecuali transform jika ada hoverScaleDuration)
      if (transitionType !== "none") {
        const baseDuration = getTransitionDuration(transitionType);
        if (hasHoverTransform && hoverScaleDuration !== null) {
          // Jika ada hoverScaleDuration, gunakan untuk transform, base duration untuk yang lain
          transitions.push(`transform ${hoverScaleDuration}ms ease-in-out`);
          transitions.push(`background-color ${baseDuration}ms ease-in-out`);
          transitions.push(`color ${baseDuration}ms ease-in-out`);
          transitions.push(`border-color ${baseDuration}ms ease-in-out`);
          transitions.push(`opacity ${baseDuration}ms ease-in-out`);
        } else {
          transitions.push(`all ${baseDuration}ms ease-in-out`);
        }
      } else if (hasHoverTransform && hoverScaleDuration !== null) {
        // Hanya transition untuk transform jika tidak ada transitionType
        transitions.push(`transform ${hoverScaleDuration}ms ease-in-out`);
      }

      transitionString = transitions.length > 0 ? transitions.join(", ") : "none";
    }

    // Build inline styles (tanpa transform hover - hanya untuk kondisi normal)
    const defaultFontWeight = fontWeight || "400";
    const styles: Record<string, string> = {
      backgroundColor: `#${cleanHexColor}`,
      color: `#${cleanHexLabelColor}`,
      borderRadius: `${defaultBorderRadius}px`,
      fontSize: `${defaultFontSize}px`,
      fontWeight: String(Number(defaultFontWeight) || 400),
      padding: paddingStyle,
      border: defaultBorderWidth && defaultBorderWidth > 0 ? `${defaultBorderWidth}px solid #${defaultBorderColor.replace("#", "")}` : "none",
      fontFamily: "Inter, system-ui, sans-serif",
      cursor: "pointer",
      transition: transitionString,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      outline: "none",
    };

    // Jika widthStyle di-set (sumbu x = 100), tambahkan width dan ubah display menjadi flex
    if (widthStyle) {
      styles.width = widthStyle;
      styles.display = "flex";
    }

    // Convert styles object to string
    const styleString = Object.entries(styles)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value}`)
      .join("; ");

    // Build hover styles
    const hoverStyles: string[] = [];

    // Helper function untuk membersihkan hex color tanpa side effects
    const cleanHexForStyle = (hex: string): string => {
      if (!hex || hex.trim() === "") return "";
      let cleaned = hex.trim().toUpperCase();
      if (!cleaned.startsWith("#")) {
        cleaned = `#${cleaned}`;
      }
      if (cleaned.length === 4) {
        cleaned = `#${cleaned[1]}${cleaned[1]}${cleaned[2]}${cleaned[2]}${cleaned[3]}${cleaned[3]}`;
      }
      if (!/^#[0-9A-F]{6}$/.test(cleaned)) {
        return "";
      }
      return cleaned;
    };

    // Hover background color - terapkan jika ada nilai yang valid
    if (hoverBgColor && hoverBgColor.trim() !== "") {
      const cleanedHoverBgColor = cleanHexForStyle(hoverBgColor);
      if (cleanedHoverBgColor) {
        hoverStyles.push(`background-color: ${cleanedHoverBgColor} !important`);
      }
    }

    // Hover text color - terapkan jika ada nilai yang valid
    if (hoverTextColor && hoverTextColor.trim() !== "") {
      const cleanedHoverTextColor = cleanHexForStyle(hoverTextColor);
      if (cleanedHoverTextColor) {
        hoverStyles.push(`color: ${cleanedHoverTextColor} !important`);
      }
    }

    // Hover border color - terapkan jika ada nilai dan ada border
    if (hoverBorderColor && hoverBorderColor.trim() !== "" && defaultBorderWidth > 0) {
      const cleanedHoverBorderColor = cleanHexForStyle(hoverBorderColor);
      if (cleanedHoverBorderColor) {
        hoverStyles.push(`border-color: ${cleanedHoverBorderColor} !important`);
      }
    }

    // Hover opacity (jika di-set dan bukan 100%)
    if (hoverOpacity !== null && hoverOpacity !== 100) {
      hoverStyles.push(`opacity: ${hoverOpacity / 100}`);
    }

    // Combine all transform properties into one
    const transformProps: string[] = [];
    if (hoverScale !== null || hoverScaleType !== "none") {
      const scaleValue = hoverScale !== null ? hoverScale : getHoverScaleValue(hoverScaleType);
      transformProps.push(`scale(${scaleValue / 100})`);
    }
    if (hoverTranslateX !== null && hoverTranslateX !== 0) {
      transformProps.push(`translateX(${hoverTranslateX}px)`);
    }
    if (hoverRotate !== null && hoverRotate !== 0) {
      transformProps.push(`rotate(${hoverRotate}deg)`);
    }

    // Add combined transform if any transform properties exist
    if (transformProps.length > 0) {
      hoverStyles.push(`transform: ${transformProps.join(" ")}`);
    }

    // Generate unique ID for this button instance
    const buttonId = `preview-button-${Math.random().toString(36).substr(2, 9)}`;

    // Build CSS hover rules
    let hoverCss = "";
    if (hoverStyles.length > 0) {
      hoverCss = `<style type="text/css">
        #${buttonId}:hover {
          ${hoverStyles.join("; ")}
        }
      </style>`;
    }

    return `${hoverCss}<button id="${buttonId}" style="${styleString}">${defaultLabel}</button>`;
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

  const generateCode = useCallback(
    async (hexColor: string, label: string, borderRadius: number, fontSize: number, padding: string, hexLabelColor: string) => {
      // Default values jika parameter kosong
      const defaultHexColor = hexColor || "#171717";
      const defaultLabel = label || "Tombol";
      const defaultBorderRadius = borderRadius || 8;
      const defaultFontSize = fontSize || 16;
      const defaultHexLabelColor = hexLabelColor || "#FFFFFF";
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
          // Hanya satu nilai (lebar atau tinggi saja)
          if (values[0] === 100) {
            tailwindWidth = "w-full";
            tailwindPadding = "p-[10px]";
          } else {
            tailwindPadding = `p-[${values[0]}px]`;
          }
        } else if (values.length === 2) {
          // Dua nilai (sumbu x, sumbu y)
          if (values[0] === 100) {
            // Jika sumbu x = 100, gunakan w-full dan padding hanya untuk sumbu y
            tailwindWidth = "w-full";
            tailwindPadding = `py-[${values[1]}px]`;
          } else {
            // Format normal: py px
            tailwindPadding = `py-[${values[1]}px] px-[${values[0]}px]`;
          }
        }
      }

      const cleanHexColor = defaultHexColor.replace("#", "");
      const cleanHexLabelColor = defaultHexLabelColor.replace("#", "");

      // Base classes
      const defaultFontWeight = fontWeight || "400";
      let classes = `bg-[#${cleanHexColor}] rounded-[${defaultBorderRadius}px] text-[${defaultFontSize}px] font-[${defaultFontWeight}] ${
        tailwindWidth ? tailwindWidth + " " : ""
      }${tailwindPadding} text-[#${cleanHexLabelColor}] cursor-pointer`;

      // Border styling
      if (defaultBorderWidth > 0) {
        const cleanBorderColor = defaultBorderColor.replace("#", "");
        classes += ` border-[#${cleanBorderColor}] border-[${defaultBorderWidth}px]`;
      }

      // Dynamic styling classes
      // Hover text color - selalu tambahkan jika ada nilai
      if (hoverTextColor && hoverTextColor.trim() !== "") {
        const cleanHoverTextColor = hoverTextColor.replace("#", "");
        classes += ` hover:text-[#${cleanHoverTextColor}]`;
      }

      // Hover background color - selalu tambahkan jika ada nilai
      if (hoverBgColor && hoverBgColor.trim() !== "") {
        const cleanHoverBgColor = hoverBgColor.replace("#", "");
        classes += ` hover:bg-[#${cleanHoverBgColor}]`;
      }

      // Hover border color - selalu tambahkan jika ada nilai
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

      // Hover scale - prioritaskan input manual, jika tidak ada gunakan hoverScaleType
      // Selalu tambahkan jika ada nilai yang valid (bukan null dan lebih dari 0)
      let hasHoverScale = false;
      if (hoverScale !== null && hoverScale > 0) {
        classes += ` hover:scale-[${hoverScale / 100}]`;
        hasHoverScale = true;
      } else if (hoverScaleType !== "none") {
        const scaleValue = getHoverScaleValue(hoverScaleType);
        classes += ` hover:scale-[${scaleValue / 100}]`;
        hasHoverScale = true;
      }

      // Transition - gunakan hoverScaleDuration jika ada untuk hover transform, atau transitionType
      const hasHoverTransform = hasHoverScale || (hoverTranslateX !== null && hoverTranslateX !== 0) || (hoverRotate !== null && hoverRotate !== 0);

      // Gunakan hoverScaleDuration untuk durasi transition jika ada hover transform dan hoverScaleDuration di-set
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

      const htmltailwind = `<button class="${classes}">${defaultLabel}</button>`;
      const formattedHtml = await formatHTML(htmltailwind);
      setHtmltailwind(formattedHtml);
      return { htmltailwind: formattedHtml };
    },
    [
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
    ],
  );

  // Generate code on mount and when dependencies change
  useEffect(() => {
    (async () => {
      // Gunakan default jika null/kosong
      const hexColor = color ? cleanHexColor(color) : "#171717";
      const hexLabelColor = labelColor ? cleanHexColor(labelColor) : "#FFFFFF";
      const finalBorderRadius = borderRadius !== null ? borderRadius : 8;
      const finalFontSize = fontSize !== null ? fontSize : 16;
      const finalLabel = label || "Tombol";
      await generateCode(hexColor, finalLabel, finalBorderRadius, finalFontSize, padding, hexLabelColor);
    })();
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
    generateCode,
  ]);

  const handleCreateButtonClick = useCallback(async () => {
    const hexColor = color ? cleanHexColor(color) : "#171717";
    const hexLabelColor = labelColor ? cleanHexColor(labelColor) : "#FFFFFF";
    const finalBorderRadius = borderRadius !== null ? borderRadius : 8;
    const finalFontSize = fontSize !== null ? fontSize : 16;
    const finalLabel = label || "Tombol";
    console.log(`Creating button with color: ${hexColor}, labelColor: ${hexLabelColor}`);
    const { htmltailwind } = await generateCode(hexColor, finalLabel, finalBorderRadius, finalFontSize, padding, hexLabelColor);
    emit<CreateButtonHandler>(
      "CREATE_BUTTON",
      hexColor,
      finalLabel,
      finalBorderRadius,
      finalFontSize,
      fontWeight || "400",
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
      activeBgColor,
      activeShadowSize?.toString() || undefined,
      transitionType,
      transitionDelay?.toString() || undefined,
      hoverScaleType,
      hoverOpacity?.toString() || undefined,
      hoverScale?.toString() || undefined,
      hoverScaleDuration?.toString() || undefined,
      hoverTranslateX?.toString() || undefined,
      hoverRotate?.toString() || undefined,
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
    generateCode,
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
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
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
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Kolom 1: Style Statis */}
        <div style={{ maxHeight: "calc(100vh - 120px)", overflowY: "hidden", flex: 1, minWidth: 260, paddingTop: 4, paddingRight: 0 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Style Statis :</Text>
          <VerticalSpace space="small" />
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
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 0 }}>
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
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    cursor: "pointer",
                    color: theme.secondaryText,
                  }}
                >
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <path d="M8 11V8M8 5H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
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
            <VerticalSpace space="medium" />
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
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Style Dinamis :</Text>
          <VerticalSpace space="small" />
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
        <div style={{ flex: 1, minWidth: 320, maxWidth: 400, position: "sticky", top: 24, alignSelf: "flex-start", zIndex: 2, display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Live Preview :</Text>
          <div
            style={{
              border: ` 1px solid ${theme.previewBorder}`,
              borderRadius: 8,
              background: theme.previewBackground,
              flex: 1,
              minHeight: 0,
              marginBottom: 24,
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
            {previewHtml ? (
              <div
                style={{
                  width: (() => {
                    // Cek apakah sumbu x = 100
                    if (padding) {
                      const parts = padding
                        .split(",")
                        .map(val => val.trim())
                        .filter(val => val !== "");
                      const values = parts.map(val => parseInt(val, 10)).filter(val => !isNaN(val));
                      if (values.length >= 1 && values[0] === 100) {
                        return "100%";
                      }
                    }
                    return "auto";
                  })(),
                  maxWidth: "100%",
                  boxSizing: "border-box",
                }}
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <Text>
                <Muted>Preview akan muncul di sini...</Muted>
              </Text>
            )}
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <Text style={{ fontWeight: 600, fontSize: 16 }}>Kode :</Text>
            <VerticalSpace space="small" />
          </div>
          {/* Kolom 3: Live Preview & Kode */}
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
          <VerticalSpace space="small" />
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
