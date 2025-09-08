/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "475px",
        "3xl": "1600px",
      },
      animation: {
        "fade-in": "fadeIn 0.7s ease-in-out both",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "slide-out-left": "slideOutLeft 0.3s ease-in",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOutLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      spacing: {
        18: "4.5rem",
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
    },
  },
  plugins: [],
};
