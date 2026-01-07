import { Button, Text, VerticalSpace } from "@create-figma-plugin/ui";
import { h } from "preact";

const components = ["Button", "Checkbox", "Text Field", "Radio Button", "Tabs", "Switch", "Alert Banner", "Tooltip", "Progress Indicator", "Data Table"];

type ComponentListProps = {
  onSelectComponent: (name: string) => void;
  onBack: () => void;
  isDark?: boolean;
};

export function ComponentList({ onSelectComponent, onBack, isDark = false }: ComponentListProps) {
  const background = isDark ? "#0B1120" : "#FFFFFF";
  const headingColor = isDark ? "#F1F5F9" : "#222222";
  const subheadingColor = isDark ? "#94A3B8" : "#444444";
  const buttonBackground = isDark ? "#2563EB" : "#189EFF";
  const buttonShadow = isDark ? "0 10px 30px rgba(37, 99, 235, 0.35)" : "0 2px 8px rgba(0,0,0,0.04)";
  const buttonTextColor = "#FFFFFF";
  const iconColor = isDark ? "#60A5FA" : "#007AFF";
  const panelBackground = isDark ? "#111827" : "#FFFFFF";

  return (
    <div
      style={{
        padding: "48px 70px",
        minHeight: "100vh",
        background,
        color: headingColor,
        alignItems: "center",
        transition: "background 0.25s ease, color 0.25s ease",
      }}
    >
      {/* Header dengan ikon back dan judul */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", marginLeft: -20, marginRight: 5, padding: 0, display: "flex", alignItems: "center" }}>
          <svg width="18" height="24" viewBox="0 0 20 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.57426 13.7604C1.58095 13.5264 1.62774 13.3125 1.71464 13.1187C1.80155 12.9248 1.93524 12.7376 2.11573 12.5571L12.1629 2.8308C12.4504 2.54335 12.8047 2.39963 13.2258 2.39963C13.5066 2.39963 13.7606 2.46648 13.9879 2.60017C14.2218 2.73387 14.4057 2.91436 14.5394 3.14164C14.6798 3.36892 14.7499 3.62294 14.7499 3.9037C14.7499 4.31816 14.5929 4.68248 14.2787 4.99666L5.19407 13.7504L14.2787 22.5141C14.5929 22.835 14.7499 23.1993 14.7499 23.6071C14.7499 23.8945 14.6798 24.1519 14.5394 24.3792C14.4057 24.6064 14.2218 24.7869 13.9879 24.9206C13.7606 25.061 13.5066 25.1312 13.2258 25.1312C12.8047 25.1312 12.4504 24.9841 12.1629 24.69L2.11573 14.9637C1.92856 14.7832 1.79152 14.596 1.70462 14.4021C1.61771 14.2016 1.57426 13.9877 1.57426 13.7604Z"
              fill={iconColor}
            />
          </svg>
        </button>
        <Text style={{ fontSize: 48, fontWeight: 600, color: headingColor }}>Daftar Komponen</Text>
      </div>
      <VerticalSpace space="large" />

      <Text style={{ fontSize: 20, color: subheadingColor, marginLeft: 5, marginBottom: 40 }}>Pilih komponen yang ingin Anda buat</Text>
      {/* Grid tombol komponen */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "32px",
        }}
      >
        {components.map((name, index) => {
          const isLastItem = index === components.length - 1;
          const remainder = components.length % 3;
          const shouldCenter = isLastItem && remainder === 1;

          return (
            <div
              key={name}
              style={{
                display: "flex",
                justifyContent: "center",
                ...(shouldCenter && {
                  gridColumn: "1 / -1",
                }),
              }}
            >
              <Button
                style={{
                  cursor: "pointer",
                  hover: "primaryButton",
                  fontSize: 26,
                  fontWeight: 400,
                  borderRadius: 16,
                  background: buttonBackground,
                  color: buttonTextColor,
                  minHeight: 72,
                  width: "320px",
                  boxShadow: buttonShadow,
                  border: "none",
                  transition: "transform 0.15s ease, box-shadow 0.2s ease",
                  backgroundImage: isDark ? "linear-gradient(120deg, #3B82F6, #1D4ED8)" : "linear-gradient(120deg, #1FB6FF, #0091FF)",
                }}
                class="component-button"
                fullWidth={false}
                onClick={() => onSelectComponent(name)}
              >
                {name}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
