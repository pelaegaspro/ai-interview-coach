module.exports = {
  content: ["./frontend/index.html", "./frontend/src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08111f",
        panel: "#0b1528",
        accent: "#22d3ee",
        highlight: "#f97316"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(8, 17, 31, 0.45)"
      },
      backgroundImage: {
        "mesh-dark":
          "radial-gradient(circle at 0% 0%, rgba(34, 211, 238, 0.20), transparent 35%), radial-gradient(circle at 100% 0%, rgba(249, 115, 22, 0.18), transparent 32%), linear-gradient(180deg, #08111f 0%, #04070d 100%)"
      }
    }
  },
  plugins: []
};
