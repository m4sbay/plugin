import { Button, Text, VerticalSpace } from "@create-figma-plugin/ui";
import { h } from "preact";

export function Dashboard({ onStart }: { onStart: () => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        textAlign: "center",
      }}
    >
      <Text style={{ fontSize: 56, fontWeight: 500, color: "#222", marginBottom: 16 }}>Selamat Datang di iTailwind</Text>

      <VerticalSpace space="large" />
      <Text style={{ fontSize: 16, color: "#444", marginBottom: 48 }}>Design Komponen Kamu Langsung Dengan Code Tanpa Mendefenisikan Satu Persatu</Text>
      <Button
        style={{
          fontSize: 24,
          fontWeight: 500,
          padding: "18px 48px",
          borderRadius: 12,
          background: "#189EFF",
          color: "#fff",
          minWidth: 280,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 60,
        }}
        fullWidth={false}
        onClick={onStart}
      >
        Mulai Sekarang
      </Button>
    </div>
  );
}
