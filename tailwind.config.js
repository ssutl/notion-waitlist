module.exports = {
  purge: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        height: "height",
      },
      width: {
        "11/20": "55%",
      },
    },
  },
  daisyui: {
    themes: false, // disable all themes
    darkTheme: false, // enable dark theme
    base: false, // disable base theme
  },
  variants: {},
  plugins: [require("daisyui")],
};
