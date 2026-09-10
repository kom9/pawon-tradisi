/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0f5238",
          container: "#2d6a4f",
          oncontainer: "#a8e7c5",
          fixed: "#b1f0ce",
          dim: "#95d4b3",
          deep: "#1b4332",
        },
        secondary: {
          DEFAULT: "#904d00",
          container: "#fe932c",
          oncontainer: "#663500",
          fixed: "#ffdcc3",
          dim: "#ffb77d",
          gold: "#d97706",
        },
        tertiary: {
          DEFAULT: "#783300",
          container: "#9d4500",
          oncontainer: "#ffd0b8",
          bakar: "#b45309",
        },
        surface: {
          canvas: "#f6fbf5",
          dim: "#d7dbd6",
          lowest: "#ffffff",
          low: "#f0f5f0",
          DEFAULT: "#ebefea",
          high: "#e5e9e4",
          highest: "#dfe4df",
        },
        ink: {
          DEFAULT: "#181d1a",
          variant: "#404943",
          arang: "#1f2421",
          inverse: "#2c322e",
        },
        outline: {
          DEFAULT: "#707973",
          variant: "#bfc9c1",
          editorial: "#e6dec9",
        },
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
          oncontainer: "#93000a",
        },
        // Badge status literal dari desain admin panel
        status: {
          fresh: "#e8f5e9",
          freshText: "#1b4332",
          steam: "#e0f2fe",
          steamText: "#0369a1",
          amber: "#fef3c7",
          amberText: "#92400e",
          pay: "#ffedd5",
          payText: "#c2410c",
          done: "#f3f4f6",
          doneText: "#374151",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
      fontSize: {
        display: ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "600" }],
        headlineLg: ["36px", { lineHeight: "44px", letterSpacing: "-0.015em", fontWeight: "600" }],
        headlineMd: ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        headlineSm: ["20px", { lineHeight: "28px", fontWeight: "600" }],
        titleLg: ["18px", { lineHeight: "26px", letterSpacing: "-0.005em", fontWeight: "600" }],
        titleMd: ["16px", { lineHeight: "24px", fontWeight: "600" }],
        bodyLg: ["16px", { lineHeight: "26px" }],
        bodyMd: ["14px", { lineHeight: "22px" }],
        bodySm: ["12px", { lineHeight: "18px", letterSpacing: "0.01em" }],
        labelMd: ["13px", { lineHeight: "18px", letterSpacing: "0.02em", fontWeight: "600" }],
        labelSm: ["11px", { lineHeight: "16px", letterSpacing: "0.04em", fontWeight: "700" }],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        card: "1rem",
        hero: "1.5rem",
      },
      boxShadow: {
        warm: "0 4px 16px -2px rgba(45,36,27,0.08), 0 2px 6px -1px rgba(45,36,27,0.04)",
        warmLg: "0 16px 36px -4px rgba(31,36,33,0.16), 0 6px 12px -2px rgba(31,36,33,0.08)",
      },
      maxWidth: {
        site: "1280px",
        editorial: "780px",
      },
    },
  },
  plugins: [],
};
