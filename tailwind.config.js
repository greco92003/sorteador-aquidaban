/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Fundamental para funcionar via .dark
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    // Se seus arquivos .css estiverem em outro local,
    // não é necessário listar aqui (a `content` é para HTML/JS/TSX).
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-animate"), // se estiver usando @plugin "tailwindcss-animate";
  ],
};
