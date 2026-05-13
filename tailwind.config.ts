import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        shell: {
          black: "#050605",
          base: "#090a0a",
          panel: "#111213",
          soft: "#151718",
          border: "#2a2c2e",
          muted: "#7d8490",
          text: "#f2f4f0",
          green: "#00ff57"
        }
      },
      fontFamily: {
        mono: [
          "var(--font-space-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace"
        ],
        sans: [
          "var(--font-inter)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ]
      },
      boxShadow: {
        glow: "0 18px 45px rgba(0, 255, 87, 0.18)",
        panel: "0 28px 90px rgba(0, 0, 0, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
