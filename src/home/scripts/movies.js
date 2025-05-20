
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("profile-btn");
  const menu = document.getElementById("profile-menu");
  const menuLinks = menu.querySelectorAll("a");

  btn.addEventListener("animation-complete", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    menu.hidden = expanded;
  });

  btn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      menu.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      menuLinks[0].focus();
    }
  });

  menu.addEventListener("keydown", (e) => {
    const idx = Array.from(menuLinks).indexOf(document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (idx + 1) % menuLinks.length;
      menuLinks[next].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (idx - 1 + menuLinks.length) % menuLinks.length;
      menuLinks[prev].focus();
    } else if (e.key === "Escape") {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      btn.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }
  });

  // Use relative path for fetch
  fetch("../../../data/movies.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("La respuesta no fue exitosa");
      }
      return response.json();
    })
    .then((data) => {
      const container = document.querySelector(".movie-container");
      if (!container) return;
      container.innerHTML = ""; // Clear existing content

      data.forEach((movie) => {
        const element = document.createElement("div");
        element.className = "element";
        element.innerHTML = `
      <button type="button" class="fav-icon" aria-label="Agregar a favoritos">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="32px" heigth="32px" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </button>
      <img src="${movie.image || ""}" alt="${
          movie.title ? movie.title : "Sin título"
        }" />
      <div class="movie-info">
        <strong>${movie.title || "Sin título"} (${movie.year || "?"})</strong>
      </div>
    `;
        container.appendChild(element);
      });
    })
    .catch((error) => {
      console.error("Hubo un problema al obtener los datos:", error);
    });
});
