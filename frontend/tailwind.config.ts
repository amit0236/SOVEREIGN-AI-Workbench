import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sov: {
          dark: "#161616",
          darker: "#0F0F0F",
          surface: "#1F1F1F",
          card: "#262626",
          borderDark: "#333333",
          bg: "#F8F8F6",
          bgDarker: "#F0F0EC",
          white: "#FFFFFF",
          border: "#E2E2DC",
          borderDark2: "#CECEC8",
          text: "#1C1C1C",
          textMuted: "#4F4F4B",
          textDim: "#787873",
          green: "#2E6945",
          greenLight: "#EBF3EE",
          amber: "#8A6428",
          amberLight: "#FBF5EB",
          red: "#8C3B3B",
          redLight: "#FBEFEF",
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif"
        ],
        mono: [
          '"SFMono-Regular"',
          "Consolas",
          '"Liberation Mono"',
          "Menlo",
          "monospace"
        ]
      },
      borderRadius: {
        none: "0px",
        sm: "6px",
        DEFAULT: "10px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        full: "9999px"
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        dropdown: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)"
      }
    },
  },
  plugins: [],
};
export default config;
