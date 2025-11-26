import { Button, Text, VerticalSpace } from "@create-figma-plugin/ui";
import { h } from "preact";

type DashboardProps = {
  onStart: () => void;
  isDark?: boolean;
};

export function Dashboard({ onStart, isDark = false }: DashboardProps) {
  const background = isDark ? "#0F172A" : "#FFFFFF";
  const headingColor = isDark ? "#F8FAFC" : "#222222";
  const subheadingColor = isDark ? "#CBD5F5" : "#444444";
  const buttonBackground = isDark ? "#2563EB" : "#189EFF";
  const buttonShadow = isDark ? "0 4px 24px rgba(15, 23, 42, 0.45)" : "0 2px 8px rgba(0,0,0,0.08)";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background,
        textAlign: "center",
      }}
    >
      <Text style={{ fontSize: 56, fontWeight: 500, color: headingColor, marginBottom: 16 }}>Selamat Datang di iTailwind</Text>

      <VerticalSpace space="large" />
      <Text style={{ fontSize: 16, color: subheadingColor, marginBottom: 48 }}>Design Komponen Kamu Langsung Dengan Code Tanpa Mendefenisikan Satu Persatu</Text>
      <Button
        style={{
          fontSize: 24,
          fontWeight: 500,
          padding: "18px 48px",
          borderRadius: 12,
          background: buttonBackground,
          color: "#fff",
          minWidth: 280,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 60,
          boxShadow: buttonShadow,
        }}
        fullWidth={false}
        onClick={onStart}
      >
        Mulai Sekarang
      </Button>
    </div>
  );
}
