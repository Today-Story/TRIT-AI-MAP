/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#EEFDFF",
          200: "#AAD0F7",
          300: "#007FFF",
        },
        placeholder: "#A6D6F4",
        "dark-blue": "#254685",
      },
      maxWidth: {
        mobile: "450px",
      },
      maxHeight: {
        drawer: "80vh",
      },
      screens: {
        mobile: "450px",
      },
      aspectRatio: {
        "video-vertical": "9 / 16",
        "hide-card": "5 / 6",
      },
      fontSize: {
        xxs: "0.625rem",
      },
    },
  },
  plugins: [],
};
