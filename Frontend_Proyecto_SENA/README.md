# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


NOTAS

Para correr adecuadamente el proyecto y sus estilos es necesario:
1. Terminal 1: npm run dev
2. Terminal 2: tailwind.config.js: npx tailwindcss -i ./src/styles/tailwind.css -o ./public/final_style.css --watch
