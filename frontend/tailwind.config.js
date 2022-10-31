const { colors } = require(`tailwindcss/defaultTheme`)

module.exports = {
  mode: "jit", // see https://tailwindcss.com/docs/just-in-time-mode
  purge: ["./components/**/*.js", "./pages/**/*.js"],
  darkMode: false, // or "media" or "class"
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
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          md: "2rem",
        },
      },
    },
    fontSize: {
      xs: "15px",
      sm: "18px",
      base: "24px",
      lg: "28px",
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
