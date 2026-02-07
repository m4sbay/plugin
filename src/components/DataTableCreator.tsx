import { Button, Dropdown, IconClose16, IconDev16, IconWand16, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
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
import { copyToClipboard } from "../utils/clipboardUtils";

type DataTableCreatorProps = {
  onBack: () => void;
  isDark?: boolean;
};

export function DataTableCreator({ onBack, isDark = false }: DataTableCreatorProps) {
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
  // --- Style Statis (urutan sesuai input di UI) ---
  const [columns, setColumns] = useState("Name,Email,Role");
  const [rows, setRows] = useState("3");
  const [headerBgColor, setHeaderBgColor] = useState("#F3F4F6");
  const [headerTextColor, setHeaderTextColor] = useState("#111827");
  const [rowBgColor, setRowBgColor] = useState("#FFFFFF");
  const [stripedRowBgColor, setStripedRowBgColor] = useState("#F9FAFB");
  const [rowTextColor, setRowTextColor] = useState("#374151");
  const [borderColor, setBorderColor] = useState("#E5E7EB");
  const [fontSize, setFontSize] = useState("14");
  const [padding, setPadding] = useState("12px,16px");
  const [textAlignment, setTextAlignment] = useState("left");
  const [stripedRows, setStripedRows] = useState("yes");

  const stripedRowsOptions = [
    { value: "yes", text: "Ya" },
    { value: "no", text: "Tidak" },
  ];

  const textAlignmentOptions = [
    { value: "left", text: "Rata Kiri" },
    { value: "center", text: "Rata Tengah" },
    { value: "right", text: "Rata Kanan" },
  ];

  // --- UI state ---
  const [htmltailwind, setHtmltailwind] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate HTML string menggunakan useMemo
  const htmlCode = useMemo(() => {
    const columnList = columns
      .split(",")
      .map(c => c.trim())
      .filter(c => c.length > 0);
    const rowCount = parseInt(rows) || 3;

    if (columnList.length === 0) {
      return "";
    }

    const paddingY = padding.split(",")[0]?.trim().replace("px", "") || "12";
    const paddingX = padding.split(",")[1]?.trim().replace("px", "") || "16";

    const tableClasses = `border-collapse w-full border border-[${borderColor}]`;
    const headerClasses = `bg-[${headerBgColor}] text-[${headerTextColor}] text-[${fontSize}px] font-semibold`;
    // Mapping untuk Tailwind text alignment class
    const textAlignClass = textAlignment === "left" ? "text-left" : textAlignment === "center" ? "text-center" : "text-right";
    const cellClasses = `border border-[${borderColor}] px-[${paddingX}px] py-[${paddingY}px] ${textAlignClass}`;

    const headerRow = `<tr class="${headerClasses}">${columnList.map(col => `<th class="${cellClasses}">${col}</th>`).join("")}</tr>`;

    const dataRows = Array.from({ length: rowCount }, (_, i) => {
      const bgClass = stripedRows === "yes" && i % 2 === 1 ? `bg-[${stripedRowBgColor}]` : `bg-[${rowBgColor}]`;
      return `<tr class="${bgClass} text-[${rowTextColor}]">${columnList.map(() => `<td class="${cellClasses}">Data</td>`).join("")}</tr>`;
    }).join("");

    return `<table class="${tableClasses}">
  <thead>${headerRow}</thead>
  <tbody>${dataRows}</tbody>
</table>`;
  }, [columns, rows, headerBgColor, headerTextColor, rowBgColor, stripedRowBgColor, rowTextColor, borderColor, fontSize, padding, stripedRows, textAlignment]);

  // Format HTML secara async
  useEffect(() => {
    (async () => {
      if (htmlCode === "") {
        setHtmltailwind("");
        return;
      }
      const formattedHtml = await formatHTML(htmlCode);
      setHtmltailwind(formattedHtml);
    })();
  }, [htmlCode]);

  useEffect(() => {
    on<SelectionChangeHandler>("SELECTION_CHANGE", data => {
      if (!data) {
        setHtmltailwind("");
        return;
      }
      try {
        const parsed = JSON.parse(data);
        if (parsed?.componentType === "data-table") {
          if (parsed.columns !== undefined) setColumns(parsed.columns || "Name,Email,Role");
          if (parsed.rows !== undefined) setRows(parsed.rows || "3");
          if (parsed.headerBgColor !== undefined) setHeaderBgColor(parsed.headerBgColor || "#F3F4F6");
          if (parsed.headerTextColor !== undefined) setHeaderTextColor(parsed.headerTextColor || "#111827");
          if (parsed.rowBgColor !== undefined) setRowBgColor(parsed.rowBgColor || "#FFFFFF");
          if (parsed.stripedRowBgColor !== undefined) setStripedRowBgColor(parsed.stripedRowBgColor || "#F9FAFB");
          if (parsed.rowTextColor !== undefined) setRowTextColor(parsed.rowTextColor || "#374151");
          if (parsed.borderColor !== undefined) setBorderColor(parsed.borderColor || "#E5E7EB");
          if (parsed.fontSize !== undefined) setFontSize(parsed.fontSize || "14");
          if (parsed.padding !== undefined) setPadding(parsed.padding || "12px,16px");
          if (parsed.stripedRows !== undefined) setStripedRows(parsed.stripedRows || "yes");
          if (parsed.textAlignment !== undefined) setTextAlignment(parsed.textAlignment || "left");
          if (parsed.htmltailwind !== undefined) setHtmltailwind(parsed.htmltailwind || "");
        }
      } catch (error) {
        setHtmltailwind(data);
      }
    });
  }, []);

  const handleCopyCode = useCallback(async () => {
    const success = await copyToClipboard(htmltailwind);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [htmltailwind]);

  // Emit ke Figma
  const handleCreateDataTable = () => {
    emit("CREATE_DATA_TABLE", {
      columns,
      rows,
      headerBgColor,
      headerTextColor,
      rowBgColor,
      stripedRowBgColor,
      rowTextColor,
      borderColor,
      fontSize,
      padding,
      stripedRows,
      textAlignment,
      htmltailwind,
    });
  };

  const columnList = columns.split(",").map(c => c.trim());
  const rowCount = parseInt(rows) || 3;

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
      <div style={{ display: "flex", alignItems: "center" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", marginRight: 8, padding: 0, display: "flex", alignItems: "center" }}>
          <svg width="15" height="20" viewBox="0 0 20 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.57426 13.7604C1.58095 13.5264 1.62774 13.3125 1.71464 13.1187C1.80155 12.9248 1.93524 12.7376 2.11573 12.5571L12.1629 2.8308C12.4504 2.54335 12.8047 2.39963 13.2258 2.39963C13.5066 2.39963 13.7606 2.46648 13.9879 2.60017C14.2218 2.73387 14.4057 2.91436 14.5394 3.14164C14.6798 3.36892 14.7499 3.62294 14.7499 3.9037C14.7499 4.31816 14.5929 4.68248 14.2787 4.99666L5.19407 13.7504L14.2787 22.5141C14.5929 22.835 14.7499 23.1993 14.7499 23.6071C14.7499 23.8945 14.6798 24.1519 14.5394 24.3792C14.4057 24.6064 14.2218 24.7869 13.9879 24.9206C13.7606 25.061 13.5066 25.1312 13.2258 25.1312C12.8047 25.1312 12.4504 24.9841 12.1629 24.69L2.11573 14.9637C1.92856 14.7832 1.79152 14.596 1.70462 14.4021C1.61771 14.2016 1.57426 13.9877 1.57426 13.7604Z"
              fill={theme.accent}
            />
          </svg>
        </button>
        <Text style={{ fontSize: 28, fontWeight: 600, color: theme.primaryText }}>Data Table</Text>
      </div>
      <VerticalSpace space="large" />
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start", }}>
        {/* Kolom 1: Style */}
        <div style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto", flex: 1, minWidth: 260, paddingRight: 16, paddingTop: 12 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, color: theme.primaryText }}>Style Statis :</Text>
          <VerticalSpace space="large" />
          <InputField label=" Label Kolom (pisahkan dengan koma) :" value={columns} onChange={setColumns} placeholder="Contoh: Name,Email,Role" />
          <InputField label="Jumlah Baris :" value={rows} onChange={setRows} placeholder="Contoh: 3" />
          <ColorPicker label="Warna latar header :" value={headerBgColor} onChange={setHeaderBgColor} />
          <ColorPicker label="Warna teks header :" value={headerTextColor} onChange={setHeaderTextColor} />
          <ColorPicker label="Warna latar baris (ganjil) :" value={rowBgColor} onChange={setRowBgColor} />
          <ColorPicker label="Warna latar baris (genap) :" value={stripedRowBgColor} onChange={setStripedRowBgColor} />
          <ColorPicker label="Warna teks baris :" value={rowTextColor} onChange={setRowTextColor} />
          <ColorPicker label="Warna border :" value={borderColor} onChange={setBorderColor} />
          <InputField label="Ukuran teks (px):" value={fontSize} onChange={setFontSize} placeholder="Contoh: 14" />
          <InputField label="Padding (py,px) :" value={padding} onChange={setPadding} placeholder="Contoh: 12px,16px" />
          <Text style={{ fontWeight: 400, fontSize: 11, marginBottom: 10, color: theme.secondaryText }}>Perataan Teks :</Text>
          <Dropdown options={textAlignmentOptions} value={textAlignment} onValueChange={setTextAlignment} />
          <VerticalSpace space="large" />
          <Text style={{ fontWeight: 400, fontSize: 11, marginBottom: 10, color: theme.secondaryText }}>Striped Rows :</Text>
          <Dropdown options={stripedRowsOptions} value={stripedRows} onValueChange={setStripedRows} />
        </div>

        {/* Kolom 2: Live Preview & Kode */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 600, display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", paddingTop: 12 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, color: theme.primaryText }}>Live Preview :</Text>
          <VerticalSpace space="large" />
          <div style={{ border: `1px solid ${theme.panelBorder}`, borderRadius: 8, background: theme.panelBackground, flex: 1, minHeight: 0, padding: 24, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", border: `1px solid ${borderColor}` }}>
              <thead>
                <tr style={{ background: headerBgColor, color: headerTextColor, fontSize: `${fontSize}px`, fontWeight: 600 }}>
                  {columnList.map((col, idx) => (
                    <th
                      key={idx}
                      style={{
                        border: `1px solid ${borderColor}`,
                        padding: padding ? `${padding.split(",")[0]?.trim() || "12px"} ${padding.split(",")[1]?.trim() || "16px"}` : "12px 16px",
                        textAlign: textAlignment as "left" | "center" | "right",
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rowCount }, (_, i) => (
                  <tr
                    key={i}
                    style={{
                      background: stripedRows === "yes" && i % 2 === 1 ? stripedRowBgColor : rowBgColor,
                      color: rowTextColor,
                      fontSize: `${fontSize}px`,
                    }}
                  >
                    {columnList.map((_, colIdx) => (
                      <td
                        key={colIdx}
                        style={{
                          border: `1px solid ${borderColor}`,
                          padding: padding ? `${padding.split(",")[0]?.trim() || "12px"} ${padding.split(",")[1]?.trim() || "16px"}` : "12px 16px",
                          textAlign: textAlignment as "left" | "center" | "right",
                        }}
                      >
                        Data
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <VerticalSpace space="large" />
          <div style={{ display: "flex", gap: 12 }}>
            <Button fullWidth danger onClick={onBack}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <IconClose16 />
                Tutup
              </span>
            </Button>
            <Button fullWidth onClick={handleCreateDataTable}>
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
