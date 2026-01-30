import { Button, IconWidget24, Text, VerticalSpace } from "@create-figma-plugin/ui";
import { h } from "preact";
import { useState } from "react";

type DashboardProps = {
  onStart: () => void;
};

export function Dashboard({ onStart }: DashboardProps) {
  // Gradient background dari light blue ke teal
  const backgroundGradient = "linear-gradient(135deg, #B8E6FF 3%, #325BBF 30%, #31FA98 100%)";
  const buttonBackground = "#14C5B7";
  const buttonShadow = "0 4px 24px rgba(20, 197, 183, 0.3)";
  const [isHover, setIsHover] = useState(false);

  // Logo SVG inline
  const logoSVG = (
    <svg width="248" height="248" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" fill="white" />
      <rect x="64.498" y="61.3074" width="31.33" height="31.33" rx="8" transform="rotate(-135 64.498 61.3074)" fill="#D9D9D9" />
      <rect x="64.498" y="61.3074" width="31.33" height="31.33" rx="8" transform="rotate(-135 64.498 61.3074)" fill="url(#paint0_linear_1310_3300)" />
      <rect x="39.1523" y="86.3074" width="31.33" height="31.33" rx="8" transform="rotate(-135 39.1523 86.3074)" fill="#D1A8FF" />
      <rect x="89.459" y="86.3074" width="31.33" height="31.33" rx="8" transform="rotate(-135 89.459 86.3074)" fill="#D1A8FF" />
      <path
        d="M58.8408 72.9645C61.965 69.8403 67.0301 69.8403 70.1543 72.9645L80.9941 83.8043C84.1183 86.9285 84.1183 91.9936 80.9941 95.1178L70.1543 105.958C67.6017 108.51 63.7543 108.976 60.7275 107.357C62.8544 102.508 61.9144 97.5413 60.7773 94.9996H47.8877C44.8784 91.8672 44.9154 86.8899 48.001 83.8043L58.8408 72.9645Z"
        fill="#D9D9D9"
      />
      <path
        d="M58.8408 72.9645C61.965 69.8403 67.0301 69.8403 70.1543 72.9645L80.9941 83.8043C84.1183 86.9285 84.1183 91.9936 80.9941 95.1178L70.1543 105.958C67.6017 108.51 63.7543 108.976 60.7275 107.357C62.8544 102.508 61.9144 97.5413 60.7773 94.9996H47.8877C44.8784 91.8672 44.9154 86.8899 48.001 83.8043L58.8408 72.9645Z"
        fill="url(#paint1_linear_1310_3300)"
      />
      <defs>
        <linearGradient id="paint0_linear_1310_3300" x1="95.8281" y1="76.9724" x2="64.498" y2="76.9724" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1CABBB" />
          <stop offset="1" stopColor="#14C5B7" />
        </linearGradient>
        <linearGradient id="paint1_linear_1310_3300" x1="83.3374" y1="89.4605" x2="45.6582" y2="89.4605" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1CABBB" />
          <stop offset="1" stopColor="#14C5B7" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        background: backgroundGradient,
        overflow: "hidden",
      }}
    >
      {/* Section Kiri - Image dengan White Card */}
      <div
        style={{
          width: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px 40px 40px",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "24px",
            padding: "60px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {logoSVG}
        </div>
      </div>

      {/* Section Kanan - Content */}
      <div
        style={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 40px 60px 20px",
          textAlign: "left",
        }}
      >
        <Text style={{ fontSize: 56, fontWeight: 300, color: "#FFFFFF", marginBottom: 6, lineHeight: "1.2", width: "85%" }}>
          Selamat Datang di <span style={{ fontWeight: 600 }}>iTailwind</span>
        </Text>

        <VerticalSpace space="large" />

        <Text style={{ fontSize: 16, color: "rgba(255,255,255,0.9)", marginBottom: 48, lineHeight: "1.6", width: "65%" }}>Design Komponen Kamu Langsung Dengan Code Tanpa Mendefenisikan Satu Persatu.</Text>

        <Button
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          style={{
            fontSize: 18,
            fontWeight: 400,
            padding: "18px 40px",
            borderRadius: 12,
            background: buttonBackground,
            color: "#fff",
            minWidth: 200,
            alignItems: "center",
            justifyContent: "center",
            minHeight: 50,
            boxShadow: buttonShadow,
            className: "primaryButton",
            cursor: "pointer",
            alignSelf: "flex-start",
            border: "1px solid #DFDFDF",
            transform: isHover ? "scale(0.98)" : "scale(1)",
            transition: "transform 0.5s ease-in-out",
          }}
          fullWidth={false}
          onClick={onStart}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            Mulai Sekarang
          </span>
        </Button>

        <VerticalSpace space="medium" />

        <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", marginTop: 12 }}>
          By <span style={{ fontWeight: 500 }}>Muhammad Maulana Bayu</span>
        </Text>
      </div>
    </div>
  );
}
