/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}",
  ],

  theme: {
    extend: {

      colors: {

        yellow: {
          primary: "#D4AF37",
          secondary: "#C9A227",
          tertiary: "#E6C45A",
        },

        black: {
          primary: "#000000",
          secondary: "#1A1A1A",
          tertiary: "#2A2A2A",
        },

        white: {
          primary: "#FFFFFF",
          secondary: "#F5F5F5",
          tertiary: "#E8E8E8",
        },

        gray: {
          primary: "#CFCFCF",
          secondary: "#B0B0B0",
          tertiary: "#8A8A8A",
          quaternary: "#5A5A5A",
          quinary: "#2F2F2F",
        }

      },

      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },

      fontSize: {
        hero: "56px",
        title: "40px",
        subtitle: "28px",
        body: "16px",
        small: "14px",
      }

    }
  },

  plugins: [],
}