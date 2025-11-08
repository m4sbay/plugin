import { Button, Dropdown, Text, Textbox, VerticalSpace } from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useState, useCallback, useEffect } from "preact/hooks";
import { InputField } from "./ui/InputField";
import { ColorPicker } from "./ui/ColorPicker";

export function DataTableCreator({ onBack }: { onBack: () => void }) {
  // State untuk Data Table
  const [columns, setColumns] = useState("Name,Email,Role");
  const [rows, setRows] = useState("3");
  const [headerBgColor, setHeaderBgColor] = useState("#F3F4F6");
  const [headerTextColor, setHeaderTextColor] = useState("#111827");
  const [rowBgColor, setRowBgColor] = useState("#FFFFFF");
  const [rowTextColor, setRowTextColor] = useState("#374151");
  const [borderColor, setBorderColor] = useState("#E5E7EB");
  const [fontSize, setFontSize] = useState("14");
  const [padding, setPadding] = useState("12px,16px");
  const [stripedRows, setStripedRows] = useState("yes");

  const stripedRowsOptions = [
    { value: "yes", text: "Ya" },
    { value: "no", text: "Tidak" },
  ];

  const [htmltailwind, setHtmltailwind] = useState("");

  // Generate Tailwind code
  const generateCode = useCallback(() => {
    const columnList = columns.split(",").map(c => c.trim());
    const rowCount = parseInt(rows) || 3;
    
    let tableClasses = `border-collapse w-full border border-[${borderColor}]`;
    let headerClasses = `bg-[${headerBgColor}] text-[${headerTextColor}] text-[${fontSize}] font-semibold`;
    let cellClasses = `border border-[${borderColor}] px-[${padding.split(",")[1]?.trim() || "16px"}] py-[${padding.split(",")[0]?.trim() || "12px"}]`;
    
    const headerRow = `<tr class="${headerClasses}">${columnList.map(col => `<th class="${cellClasses}">${col}</th>`).join("")}</tr>`;
    
    const dataRows = Array.from({ length: rowCount }, (_, i) => {
      const bgClass = stripedRows === "yes" && i % 2 === 1 ? `bg-[${headerBgColor}]` : `bg-[${rowBgColor}]`;
      return `<tr class="${bgClass} text-[${rowTextColor}]">${columnList.map(() => `<td class="${cellClasses}">Data</td>`).join("")}</tr>`;
    }).join("");

    const html = `<table class="${tableClasses}">
  <thead>${headerRow}</thead>
  <tbody>${dataRows}</tbody>
</table>`;
    setHtmltailwind(html);
    return html;
  }, [columns, rows, headerBgColor, headerTextColor, rowBgColor, rowTextColor, borderColor, fontSize, padding, stripedRows]);

  useEffect(() => {
    generateCode();
  }, [generateCode]);

  // Emit ke Figma
  const handleCreateDataTable = () => {
    emit("CREATE_DATA_TABLE", {
      columns,
      rows,
      headerBgColor,
      headerTextColor,
      rowBgColor,
      rowTextColor,
      borderColor,
      fontSize,
      padding,
      stripedRows,
      htmltailwind,
    });
  };

  const columnList = columns.split(",").map(c => c.trim());
  const rowCount = parseInt(rows) || 3;

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
        <Text style={{ fontSize: 28, fontWeight: 600, color: "#222" }}>Data Table</Text>
      </div>
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Kolom 1: Style */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Pengaturan :</Text>
          <VerticalSpace space="small" />
          <InputField label="Kolom (pisahkan dengan koma) :" value={columns} onChange={setColumns} placeholder="Contoh: Name,Email,Role" />
          <InputField label="Jumlah Baris :" value={rows} onChange={setRows} placeholder="Contoh: 3" />
          <ColorPicker label="Warna latar header :" value={headerBgColor} onChange={setHeaderBgColor} />
          <ColorPicker label="Warna teks header :" value={headerTextColor} onChange={setHeaderTextColor} />
          <ColorPicker label="Warna latar baris :" value={rowBgColor} onChange={setRowBgColor} />
          <ColorPicker label="Warna teks baris :" value={rowTextColor} onChange={setRowTextColor} />
          <ColorPicker label="Warna border :" value={borderColor} onChange={setBorderColor} />
          <InputField label="Ukuran teks (px):" value={fontSize} onChange={setFontSize} placeholder="Contoh: 14" />
          <InputField label="Padding (py,px) :" value={padding} onChange={setPadding} placeholder="Contoh: 12px,16px" />
          <Dropdown options={stripedRowsOptions} value={stripedRows} onValueChange={setStripedRows} />
        </div>
        
        {/* Kolom 2: Live Preview & Kode */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 600, position: "sticky", top: 24, alignSelf: "flex-start", zIndex: 2 }}>
          <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Live Preview :</Text>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, background: "#f8f9fa", minHeight: 120, marginBottom: 24, padding: 24, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", border: `1px solid ${borderColor}` }}>
              <thead>
                <tr style={{ background: headerBgColor, color: headerTextColor, fontSize: `${fontSize}px`, fontWeight: 600 }}>
                  {columnList.map((col, idx) => (
                    <th
                      key={idx}
                      style={{
                        border: `1px solid ${borderColor}`,
                        padding: padding ? `${padding.split(",")[0]?.trim() || "12px"} ${padding.split(",")[1]?.trim() || "16px"}` : "12px 16px",
                        textAlign: "left",
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
                      background: stripedRows === "yes" && i % 2 === 1 ? headerBgColor : rowBgColor,
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
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Button fullWidth secondary onClick={onBack}>
              Tutup
            </Button>
            <Button fullWidth onClick={handleCreateDataTable}>
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

