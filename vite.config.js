import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "src/login/login.html"),
        registro: resolve(__dirname, "src/registro/registro.html"),
        movies: resolve(__dirname, "src/movies/movies.html"),
        favorites: resolve(__dirname, "src/favorites/favorites.html"),
      },
    },
  },
});
