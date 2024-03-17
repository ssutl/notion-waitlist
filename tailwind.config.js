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
  variants: {},
  plugins: [],
};
