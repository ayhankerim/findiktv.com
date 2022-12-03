const { colors } = require(`tailwindcss/defaultTheme`)
const { fontFamily } = require("tailwindcss/defaultTheme")
/** @type {import('tailwindcss').Config} \*/

module.exports = {
  mode: "jit", // see https://tailwindcss.com/docs/just-in-time-mode
  purge: ["./components/**/*.js", "./pages/**/*.js"],
  darkMode: false, // or "media" or "class"
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00A07F",
        secondary: "#004aad",
        dark: "#1F292E",
        darkgray: "#415058",
        midgray: "#9ca3af",
        lightgray: "#F2F2F3",
        warning: "#FFAB1A",
        danger: "#D4111B",
        success: "#73C322",
        info: "#6494fd",
        youtube: "#FF0000",
        point: "rgb(255,255,84)",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          md: "2rem",
        },
      },
      fontFamily: {
        sans: ["var(--font-dosis)"],
      },
    },
    fontSize: {
      xs: "13px",
      sm: "16px",
      base: "20px",
      lg: "25px",
      xl: "32px",
      xxl: "45px",
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1200px",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
}
