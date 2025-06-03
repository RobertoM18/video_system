import api from "../utils/apiHelper.js";
import { logout } from "../utils/authHelper.js";
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const themeToggle = document.getElementById("theme-toggle");
const movieModal = document.getElementById("movie-modal");
const closeModal = document.querySelector(".close-modal");
const favoritesContainer = document.getElementById("favorites-container");
const favoritesCount = document.getElementById("favorites-count");
let favoriteMovies = [];
let filteredFavorites = [];

document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  fetchFavoriteMovies();
  themeToggle.addEventListener("click", toggleTheme);
  searchButton.addEventListener("click", handleSearch);
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") handleSearch();
  });
  closeModal.addEventListener("click", closeMovieModal);
  movieModal.addEventListener("click", (e) => {
    if (e.target === movieModal) {
      closeMovieModal();
    }
  });
  document.getElementById("logout-btn").addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  });
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-remove-favorite")) {
      handleRemoveFromFavorites();
    }
  });
});

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  const body = document.body;
  const icon = themeToggle.querySelector("i");

  if (savedTheme === "dark") {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }
}

async function fetchFavoriteMovies() {
  try {
    const response = await api.get("/users/favorites");
    favoriteMovies = response.data;
    filteredFavorites = [...favoriteMovies];

    displayFavoriteMovies();
    updateFavoritesCount();
  } catch (error) {
    console.error("Error fetching favorite movies:", error);
    favoritesContainer.innerHTML =
      '<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>Error al cargar películas favoritas</p><small>Intenta recargar la página</small></div>';
    favoritesCount.textContent = "Error al cargar";
  }
}

function displayFavoriteMovies() {
  favoritesContainer.innerHTML = "";

  if (filteredFavorites.length === 0) {
    if (favoriteMovies.length === 0) {
      favoritesContainer.innerHTML =
        '<div class="no-results"><i class="fas fa-heart-broken"></i><p>No tienes películas favoritas aún</p><small>Ve a la sección de películas y agrega algunas a tus favoritos</small></div>';
    } else {
      favoritesContainer.innerHTML =
        '<div class="no-results"><i class="fas fa-search"></i><p>No se encontraron películas con ese término de búsqueda</p></div>';
    }
    return;
  }

  filteredFavorites.forEach((movie) => {
    favoritesContainer.appendChild(createMovieCard(movie));
  });
}

function createMovieCard(movie) {
  const card = document.createElement("div");
  card.className = "movie-card";

  card.innerHTML = `
    <div class="movie-poster">
      <img src="${
        movie.movie_poster ||
        "https://via.placeholder.com/300x450?text=No+Image"
      }" alt="${movie.title}">
      <div class="movie-rating">${
        movie.rating ? `★ ${movie.rating}` : "NR"
      }</div>
    </div>
    <div class="movie-info">
      <h3 class="movie-title">${movie.title}</h3>
      <div class="movie-year">${movie.year || "N/A"}</div>
    </div>
  `;

  card.addEventListener("click", () => openMovieDetails(movie));
  return card;
}

function openMovieDetails(movie) {
  document.getElementById("modal-title").textContent = movie.title;
  document.getElementById("modal-poster").src =
    movie.movie_poster || "https://via.placeholder.com/300x450?text=No+Image";
  document.getElementById("modal-year").textContent = movie.year;
  document.getElementById("modal-runtime").textContent = movie.runtime || "";
  document.getElementById("modal-rating").textContent = movie.rating
    ? `★ ${movie.rating}`
    : "Sin Rating";
  document.getElementById("modal-plot").textContent =
    movie.summary || "No existe resumen disponible";
  const genresContainer = document.getElementById("modal-genres");
  const genreArray = normalizeGenres(movie.genres);
  genresContainer.innerHTML = `<span>${genreArray.join(", ")}</span>`;
  document.getElementById("modal-director").textContent =
    movie.director || "Informacion del director no disponible";
  document.getElementById("modal-cast").textContent =
    movie.cast || "Informacion del elenco no disponible";
  movieModal.dataset.movieId = movie.id;
  movieModal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeMovieModal() {
  movieModal.style.display = "none";
  document.body.style.overflow = "";
}

async function handleRemoveFromFavorites() {
  try {
    const movieId = movieModal.dataset.movieId;
    console.log(movieModal.dataset);
    if (!movieId) {
      alert("Error: No se pudo obtener la información de la película");
      return;
    }

    const confirmRemove = confirm(
      "¿Estás seguro de que quieres eliminar esta película de tus favoritos?"
    );
    if (!confirmRemove) return;

    await api.delete(`/users/favorites/${movieId}`);
    favoriteMovies = favoriteMovies.filter((movie) => movie.id != movieId);
    filteredFavorites = filteredFavorites.filter(
      (movie) => movie.id != movieId
    );
    displayFavoriteMovies();
    updateFavoritesCount();
    closeMovieModal();
    alert("Película eliminada de favoritos");
  } catch (error) {
    console.error("Error removing from favorites:", error);
    alert("Error al eliminar de favoritos");
  }
}

function handleSearch() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  if (searchTerm) {
    filteredFavorites = favoriteMovies.filter(
      (movie) => movie.title && movie.title.toLowerCase().includes(searchTerm)
    );
  } else {
    filteredFavorites = [...favoriteMovies];
  }

  displayFavoriteMovies();
}

function updateFavoritesCount() {
  const count = favoriteMovies.length;
  favoritesCount.textContent =
    count === 1 ? "1 película favorita" : `${count} películas favoritas`;
}

function normalizeGenres(genres) {
  if (!genres) return [];
  if (typeof genres === "string")
    return genres.split(", ").map((g) => g.trim());
  return genres;
}

function toggleTheme() {
  const body = document.body;
  const icon = themeToggle.querySelector("i");

  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
    localStorage.setItem("theme", "light");
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
    localStorage.setItem("theme", "dark");
  }
}
