import { Button, Dropdown, IconClose16, IconDev16, IconWand16, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useState, useCallback, useMemo, useEffect } from "preact/hooks";
import { InputField } from "./ui/InputField";
import { SelectionChangeHandler } from "../types/types";
import { Prism as SyntaxHighlighterComponent } from "react-syntax-highlighter";
import { shadesOfPurple, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { formatHTML } from "../utils/htmlFormatter";

// Gunakan casting 'as any' untuk menghindari error JSX
const SyntaxHighlighter = SyntaxHighlighterComponent as any;
// Komponen untuk preview alert
function AlertPreview({ alertType, title, message, borderRadius, width, padding }: { alertType: string; title: string; message: string; borderRadius: string; width?: string; padding?: string }) {
  const getDefaultColors = () => {
    switch (alertType) {
      case "information":
        return {
          border: "#BFDBFE",
          bg: "#EFF6FF",
          titleColor: "#1E3A8A",
          messageColor: "#1E40AF",
        };
      case "success":
        return {
          border: "#BBF7D0",
          bg: "#F0FDF4",
          titleColor: "#14532D",
          messageColor: "#166534",
        };
      case "error":
        return {
          border: "#FECACA",
          bg: "#FEF2F2",
          titleColor: "#7F1D1D",
          messageColor: "#991B1B",
        };
      default:
        return {
          border: "#BFDBFE",
          bg: "#EFF6FF",
          titleColor: "#1E3A8A",
          messageColor: "#1E40AF",
        };
    }
  };

  const colors = getDefaultColors();
  const borderRadiusValue = borderRadius ? `${borderRadius}px` : "6px";
  const widthValue = width ? `${width}px` : "auto";
  const paddingValue = padding ? `${padding}px` : "16px";

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        borderRadius: borderRadiusValue,
        border: `1px solid ${colors.border}`,
        background: colors.bg,
        padding: paddingValue,
        width: widthValue,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div style={{ fontWeight: 600, color: colors.titleColor, fontSize: "14px", wordWrap: "break-word", overflowWrap: "break-word" }}>{title}</div>
      <p style={{ fontSize: "14px", color: colors.messageColor, margin: 0, lineHeight: "1.5", wordWrap: "break-word", overflowWrap: "break-word", textAlign: "justify" }}>{message}</p>
    </div>
  );
}

type AlertBannerCreatorProps = {
  onBack: () => void;
  isDark?: boolean;
};

export function AlertBannerCreator({ onBack, isDark = false }: AlertBannerCreatorProps) {
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
  // State untuk Alert Banner - hanya properti standar
  const [alertType, setAlertType] = useState("information");
  const [title, setTitle] = useState("Information");
  const [message, setMessage] = useState("This is an informational alert with important details.");
  const [borderRadius, setBorderRadius] = useState("6");
  const [width, setWidth] = useState("");
  const [padding, setPadding] = useState("16");
  const [htmltailwind, setHtmltailwind] = useState("");

  const alertTypeOptions = [
    { value: "information", text: "Information" },
    { value: "success", text: "Success" },
    { value: "error", text: "Error" },
  ];

  // Auto-set title berdasarkan alert type
  useEffect(() => {
    switch (alertType) {
      case "information":
        if (!title || title === "Success" || title === "Error") {
          setTitle("Information");
        }
        break;
      case "success":
        if (!title || title === "Information" || title === "Error") {
          setTitle("Success");
        }
        break;
      case "error":
        if (!title || title === "Information" || title === "Success") {
          setTitle("Error");
        }
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
          titleColor: "text-blue-900",
          messageColor: "text-blue-800",
        };
      case "success":
        return {
          border: "border-green-200",
          bg: "bg-green-50",
          titleColor: "text-green-900",
          messageColor: "text-green-800",
        };
      case "error":
        return {
          border: "border-red-200",
          bg: "bg-red-50",
          titleColor: "text-red-900",
          messageColor: "text-red-800",
        };
      default:
        return {
          border: "border-blue-200",
          bg: "bg-blue-50",
          titleColor: "text-blue-900",
          messageColor: "text-blue-800",
        };
    }
  };

  const [copied, setCopied] = useState(false);

  // Generate HTML string menggunakan useMemo
  const htmlCode = useMemo(() => {
    const defaultColors = getAlertColors();
    const roundedClass = borderRadius ? `rounded-[${borderRadius}px]` : "rounded-md";
    const widthClass = width ? `w-[${width}px]` : "";
    const paddingClass = padding ? `p-[${padding}px]` : "p-4";

    return `<div role="alert" class="flex flex-col gap-1 ${roundedClass} border ${defaultColors.border} ${defaultColors.bg} ${paddingClass} ${widthClass}"><div class="font-semibold text-sm ${defaultColors.titleColor}">${title}</div><p class="text-sm ${defaultColors.messageColor} text-justify">${message}</p></div>`;
  }, [alertType, title, message, borderRadius, width, padding]);

  // Format HTML secara async
  useEffect(() => {
    (async () => {
      const formattedHtml = await formatHTML(htmlCode);
      setHtmltailwind(formattedHtml);
    })();
  }, [htmlCode]);

  useEffect(() => {
    on<SelectionChangeHandler>("SELECTION_CHANGE", data => {
      if (!data) {
        return;
      }
      try {
        const parsed = JSON.parse(data);
        if (parsed?.componentType === "alert-banner") {
          if (parsed.alertType !== undefined) setAlertType(parsed.alertType || "information");
          if (parsed.title !== undefined) setTitle(parsed.title || "Information");
          if (parsed.message !== undefined) setMessage(parsed.message || "This is an informational alert with important details.");
          if (parsed.borderRadius !== undefined) setBorderRadius(parsed.borderRadius || "6");
          if (parsed.width !== undefined) setWidth(parsed.width || "");
          if (parsed.padding !== undefined) setPadding(parsed.padding || "16");
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
  const handleCreateAlertBanner = () => {
    emit("CREATE_ALERT_BANNER", {
      alertType,
      title,
      message,
      borderRadius,
      width,
      padding,
      htmltailwind,
    });
  };

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
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", marginRight: 8, padding: 0, display: "flex", alignItems: "center" }}>
            <svg width="15" height="20" viewBox="0 0 20 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.57426 13.7604C1.58095 13.5264 1.62774 13.3125 1.71464 13.1187C1.80155 12.9248 1.93524 12.7376 2.11573 12.5571L12.1629 2.8308C12.4504 2.54335 12.8047 2.39963 13.2258 2.39963C13.5066 2.39963 13.7606 2.46648 13.9879 2.60017C14.2218 2.73387 14.4057 2.91436 14.5394 3.14164C14.6798 3.36892 14.7499 3.62294 14.7499 3.9037C14.7499 4.31816 14.5929 4.68248 14.2787 4.99666L5.19407 13.7504L14.2787 22.5141C14.5929 22.835 14.7499 23.1993 14.7499 23.6071C14.7499 23.8945 14.6798 24.1519 14.5394 24.3792C14.4057 24.6064 14.2218 24.7869 13.9879 24.9206C13.7606 25.061 13.5066 25.1312 13.2258 25.1312C12.8047 25.1312 12.4504 24.9841 12.1629 24.69L2.11573 14.9637C1.92856 14.7832 1.79152 14.596 1.70462 14.4021C1.61771 14.2016 1.57426 13.9877 1.57426 13.7604Z"
                fill={theme.accent}
              />
            </svg>
          </button>
          <Text style={{ fontSize: 28, fontWeight: 600, color: theme.primaryText }}>Alert Banner</Text>
        </div>
      </div>
      <VerticalSpace space="large" />
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start",}}>
        {/* Kolom 1: Pengaturan */}
        <div style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto", flex: 1, minWidth: 260, paddingTop: 12 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, color: theme.primaryText }}>Style Statis :</Text>
          <VerticalSpace space="large" />
          <div>
            <Text style={{ fontWeight: 400, fontSize: 11, marginBottom: 8, color: theme.secondaryText }}>Jenis Alert :</Text>
            <Dropdown options={alertTypeOptions} value={alertType} onValueChange={setAlertType} />
          </div>
          <VerticalSpace space="large" />
          <InputField label="Judul Alert :" value={title} onChange={setTitle} placeholder="Contoh: Information" />
          <InputField label="Pesan Alert :" value={message} onChange={setMessage} placeholder="Contoh: This is an informational alert with important details." />
          <InputField label="Lebar (px) :" value={width} onChange={setWidth} placeholder="Kosongkan untuk auto" />
          <InputField label="Padding (px) :" value={padding} onChange={setPadding} placeholder="Contoh: 16" />
          <InputField label="Border Radius (px) :" value={borderRadius} onChange={setBorderRadius} placeholder="Contoh: 6" />
        </div>

        {/* Kolom 2: Live Preview & Kode */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 500, display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", paddingTop: 12 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, color: theme.primaryText }}>Live Preview :</Text>
          <VerticalSpace space="large" />
          <div
            style={{
              border: `1px solid ${theme.panelBorder}`,
              borderRadius: 8,
              background: theme.panelBackground,
              flex: 1,
              minHeight: 0,
              padding: 24,
              overflow: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ width: "fit-content", maxWidth: "100%" }}>
              <AlertPreview alertType={alertType} title={title} message={message} borderRadius={borderRadius} width={width} padding={padding} />
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
            <Button fullWidth onClick={handleCreateAlertBanner}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <IconWand16 />
                Buat
              </span>
            </Button>
          </div>
          <VerticalSpace space="large" />
          <Text style={{ fontWeight: 600, fontSize: 16, color: theme.primaryText }}>Kode :</Text>
          <VerticalSpace space="large" />
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
