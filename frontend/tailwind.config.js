/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefbfb",
          100: "#d4f4f5",
          500: "#0f8b8d",
          600: "#0b6e70",
          900: "#093b3c",
        },
        accent: "#ff7f50",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 139, 141, 0.12)",
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top left, rgba(15,139,141,0.25), transparent 40%), linear-gradient(120deg, #042f2e, #0f172a 58%, #0f8b8d)",
      },
    },
  },
  plugins: [],
};
