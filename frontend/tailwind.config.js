/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#16273f',     // Trapped Darkness — deep navy
        ocean: '#2b5e75',    // Saltwater Denim — ocean teal-blue
        bronze: '#b48252',   // Komodo Dragon — bronze/gold
        driftwood: '#6f4b39',// Cappuccino — dark brown
        gold: '#e7c07d',     // Freshly Baked — light gold
        seafoam: '#6fb4af',  // Turquoise Fantasies — soft teal
        baltic: '#3a99a0',   // Baltic — vivid teal
        mint: '#c3e0ca',     // Delta Mint — pale mint green
      },
      fontFamily: {
        heading: ['Cinzel', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
