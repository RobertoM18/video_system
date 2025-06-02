import api from "../utils/apiHelper.js";
import { logout } from "../utils/authHelper.js";
document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  loadUserFavorites().then(() => {
    fetchMovies();
  });
  searchButton.addEventListener("click", handleSearch);
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") handleSearch();
  });
  genreFilter.addEventListener("change", applyFilters);
  yearFilter.addEventListener("change", applyFilters);
  sortBy.addEventListener("change", applyFilters);
  prevPageBtn.addEventListener("click", () => navigatePage(-1));
  nextPageBtn.addEventListener("click", () => navigatePage(1));
  themeToggle.addEventListener("click", toggleTheme);
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
    if (e.target.classList.contains("btn-add-list")) {
      if (!e.target.classList.contains("in-favorites")) {
        handleAddToFavorites();
      } else {
        handleAddToFavorites();
      }
    }
  });
  window.addEventListener("focus", () => {
    loadUserFavorites();
  });
});

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const genreFilter = document.getElementById("genre-filter");
const yearFilter = document.getElementById("year-filter");
const sortBy = document.getElementById("sort-by");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const themeToggle = document.getElementById("theme-toggle");
const movieModal = document.getElementById("movie-modal");
const closeModal = document.querySelector(".close-modal");
const btnAddList = document.getElementById("btn-add-list");
let currentPage = 1;
const moviesPerPage = 15;
let filteredMovies = [];
let userFavorites = []; // Store user's favorite movie IDs

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

function normalizeGenres(genres) {
  if (!genres) return [];
  if (typeof genres === "string")
    return genres.split(", ").map((g) => g.trim());
  return genres;
}
async function loadUserFavorites() {
  try {
    const response = await api.get("/users/favorites");
    userFavorites = response.data.map((movie) => movie.id);
  } catch (error) {
    console.error("Error loading user favorites:", error);
    userFavorites = [];
  }
}
function isMovieInFavorites(movieId) {
  return userFavorites.includes(parseInt(movieId));
}

async function fetchMovies() {
  try {
    const moviesContainer = document.getElementById("movies-container");
    const response = await api.get("/movies");
    let movies = response.data;

    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
      movies = movies.filter(
        (movie) => movie.title && movie.title.toLowerCase().includes(searchTerm)
      );
    }

    const selectedGenre = genreFilter.value;
    if (selectedGenre !== "all") {
      movies = movies.filter((movie) => {
        const genreArray = normalizeGenres(movie.genres);
        return genreArray.includes(selectedGenre);
      });
    }

    const selectedYear = yearFilter.value;
    if (selectedYear !== "all") {
      if (selectedYear === "older") {
        movies = movies.filter(
          (movie) => movie.year && parseInt(movie.year) < 2020
        );
      } else {
        movies = movies.filter(
          (movie) => movie.year && movie.year.toString() === selectedYear
        );
      }
    }

    const sortValue = sortBy.value;
    if (sortValue === "title") {
      movies.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortValue === "release-date") {
      movies.sort((a, b) => (b.year || 0) - (a.year || 0));
    } else if (sortValue === "rating") {
      movies.sort((a, b) => {
        const ratingA = a.rating ? parseFloat(a.rating.replace(",", ".")) : 0;
        const ratingB = b.rating ? parseFloat(b.rating.replace(",", ".")) : 0;
        return ratingB - ratingA;
      });
    }
    filteredMovies = movies;
    displayMovies();
  } catch (error) {
    console.error("Error al obtener peliculas:", error);
    const moviesContainer = document.getElementById("movies-container");
    moviesContainer.innerHTML =
      '<div class="error-message">No pudimos cargar las peliculas intentalo mas tarde</div>';
    document.getElementById("page-info").textContent = "Page 0 of 0";
    prevPageBtn.disabled = true;
    nextPageBtn.disabled = true;
  }
}
function displayMovies() {
  const moviesContainer = document.getElementById("movies-container");
  moviesContainer.innerHTML = "";

  if (filteredMovies && filteredMovies.length > 0) {
    const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = Math.min(
      startIndex + moviesPerPage,
      filteredMovies.length
    );
    for (let i = startIndex; i < endIndex; i++) {
      moviesContainer.appendChild(createMovieCard(filteredMovies[i]));
    }
    document.getElementById(
      "page-info"
    ).textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  } else {
    moviesContainer.innerHTML =
      '<div class="no-results">No se encontraron peliculas</div>';

    document.getElementById("page-info").textContent = "Page 0 of 0";
    prevPageBtn.disabled = true;
    nextPageBtn.disabled = true;
  }
}
function toggleTheme() {
  const body = document.body;
  const icon = themeToggle.querySelector("i");

  if (body.classList.contains("dark-mode")) {
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
    localStorage.setItem("theme", "light");
  }
}
function openMovieDetails(movie) {
  document.getElementById("modal-title").textContent = movie.title;
  document.getElementById("modal-poster").src =
    movie.movie_poster || "https://via.placeholder.com/300x450?text=No+Image";
  document.getElementById("modal-year").textContent = movie.year;
  document.getElementById("modal-runtime").textContent = movie.runtime; // Runtime not in database schema
  document.getElementById("modal-rating").textContent = movie.rating
    ? `★ ${movie.rating}`
    : "Not rated";
  document.getElementById("modal-plot").textContent =
    movie.summary || "No plot available.";
  const genresContainer = document.getElementById("modal-genres");
  const genreArray = normalizeGenres(movie.genres);
  genresContainer.innerHTML = `<span>${genreArray.join(", ")}</span>`;
  document.getElementById("modal-director").textContent =
    movie.director || "Director information not available";
  document.getElementById("modal-cast").textContent =
    movie.cast || "Cast information not available";
  movieModal.dataset.movieId = movie.id;
  movieModal.dataset.movieData = JSON.stringify(movie);
  updateFavoritesButton(movie.id);
  movieModal.style.display = "block";
  document.body.style.overflow = "hidden";
}
function updateFavoritesButton(movieId) {
  const button = document.querySelector(".btn-add-list");
  const isInFavorites = isMovieInFavorites(movieId);

  if (isInFavorites) {
    button.textContent = "Ya se encuentra en favoritos";
    button.classList.add("in-favorites");
    button.style.backgroundColor = "#6c757d";
    button.style.cursor = "default";
  } else {
    button.textContent = "Añadir a Favoritos";
    button.classList.remove("in-favorites");
    button.style.backgroundColor = "";
    button.style.cursor = "pointer";
  }
}
function closeMovieModal() {
  movieModal.style.display = "none";
  document.body.style.overflow = ""; // Restore scrolling
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

function handleSearch() {
  currentPage = 1; // Reset to first page when searching
  fetchMovies();
}

function applyFilters() {
  currentPage = 1; // Reset to first page when filters change
  fetchMovies();
}
function navigatePage(direction) {
  currentPage += direction;
  displayMovies();
  document
    .getElementById("movies-container")
    .scrollIntoView({ behavior: "smooth" });
}
async function handleAddToFavorites() {
  try {
    const movieId = movieModal.dataset.movieId;
    const button = document.querySelector(".btn-add-list");

    if (!movieId) {
      alert("Error: No se pudo obtener la información de la película");
      return;
    }
    if (isMovieInFavorites(movieId)) {
      const response = await api.delete(`/users/favorites/${movieId}`);
      userFavorites = userFavorites.filter((id) => id !== parseInt(movieId));
      updateFavoritesButton(movieId);
      const originalText = button.textContent;
      button.textContent = "¡Eliminado!";
      button.style.backgroundColor = "#dc3545";

      setTimeout(() => {
        updateFavoritesButton(movieId);
      }, 1500);
    } else {
      const response = await api.post("/users/favorites", {
        movieId: parseInt(movieId),
      });
      userFavorites.push(parseInt(movieId));
      updateFavoritesButton(movieId);
      const originalText = button.textContent;
      button.textContent = "¡Agregado!";
      button.style.backgroundColor = "#28a745";

      setTimeout(() => {
        updateFavoritesButton(movieId);
      }, 1500);
    }
  } catch (error) {
    console.error("Error managing favorites:", error);

    let errorMessage = "Error al gestionar favoritos";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    alert(errorMessage);
  }
}
