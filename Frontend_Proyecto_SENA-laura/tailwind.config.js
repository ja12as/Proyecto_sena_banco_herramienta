/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      inter: ["Inter"],
    },
    extend: {
      colors: {
        sena: "#01AF08",
        fondo: "#F9FDEC",
        gris: "#938B8B",
        negro: "#000000",
        input: "#1E1E1E",
        correo: "#7BA3DF",
        grisClaro: "#D9D9D9",
        noEdit: "#A59C9C",
        naranja: "#fd7e14",
        primaryDark: '#006400', 
        red700: '#B22222',      
      },
      margin: {
        custom: "20rem",
      },
    },
  },
  variants: {
    boderWidth: ["responsive", "hover", "focus"],
    display: ["focus-group"],
  },
  plugins: [],
};
