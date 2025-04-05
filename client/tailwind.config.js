module.exports = {
    content: ["./src/**/*.{js,jsx}"],
    theme: {
      extend: {
        fontFamily: {
          poppins: ["Poppins", "sans-serif"],
          montserrat: ["Montserrat", "sans-serif"],
        },
        animation: {
          book: "none", // container placeholder
          pageTurn1: "pageTurn 1.2s cubic-bezier(0, 0.39, 1, 0.68) 0.6s infinite",
          pageTurn2: "pageTurn 1.2s cubic-bezier(0, 0.39, 1, 0.68) 1.45s infinite",
          pageTurn3: "pageTurn 1.2s cubic-bezier(0, 0.39, 1, 0.68) 1.2s infinite",
        },
        keyframes: {
          pageTurn: {
            "0%": { transform: "rotateY(0deg)" },
            "20%": { background: "#293241" },
            "40%": { background: "#293241", transform: "rotateY(-180deg)" },
            "100%": { background: "#293241", transform: "rotateY(-180deg)" },
          },
        },
      },
    },
    plugins: [],
  };
  