"use strict";

/**
 * UIManager - Handles DOM rendering of recipes with performance optimizations
 * @module ui
 */

export class UIManager {
  constructor({ recipeListId }) {
    this.recipeListEl = document.getElementById(recipeListId);
    if (!this.recipeListEl)
      throw new Error(`Element with id ${recipeListId} not found`);
    this.intersectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute("data-src");
            if (src) {
              img.src = src;
              img.removeAttribute("data-src");
            }
            observer.unobserve(img);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );
  }

  createRecipeCard(recipe) {
    const card = document.createElement("article");
    card.className = "recipe-card";

    // Keyboard accessibility
    card.tabIndex = 0;
    card.setAttribute("role", "region");
    card.setAttribute("aria-label", `Recipe: ${recipe.title}`);

    // Image setup: use actual image, fallback to placeholder if not found
    const img = document.createElement("img");
    img.className = "recipe-card__image";
    img.alt = recipe.title;

    // Get image path, fallback if empty
    const imgPath =
      recipe.imageURL && typeof recipe.imageURL === "string"
        ? recipe.imageURL
        : "/assets/images/placeholder.jpg";

    // Set placeholder as initial src for lazy loading
    img.src = "/assets/images/placeholder.jpg";
    img.setAttribute("data-src", imgPath);

    // Robust error fallback
    img.onerror = () => {
      img.src = "/assets/images/placeholder.jpg";
    };

    // Observe the image for lazy loading if supported, else load directly
    if (this.intersectionObserver) {
      this.intersectionObserver.observe(img);
    } else {
      img.src = imgPath;
    }

    const content = document.createElement("div");
    content.className = "recipe-card__content";

    // Title element
    const title = document.createElement("h2");
    title.className = "recipe-card__title";
    title.textContent = recipe.title;

    // Description
    const description = document.createElement("p");
    description.className = "recipe-card__description";
    description.textContent = recipe.description;

    // Meta info: prep/cook times and difficulty
    const meta = document.createElement("div");
    meta.className = "recipe-card__meta";

    const prepCook = document.createElement("span");
    prepCook.textContent = `Prep: ${recipe.prepTime} min | Cook: ${recipe.cookTime} min`;

    const difficulty = document.createElement("span");
    difficulty.className = `recipe-card__difficulty recipe-card__difficulty--${recipe.difficulty}`;
    difficulty.textContent = recipe.difficulty.toUpperCase();

    meta.append(prepCook, difficulty);

    content.append(title, description, meta);
    card.append(img, content);

    // Navigation & keyboard click support
    card.addEventListener("click", () => {
      window.location.href = `/pages/detail.html?id=${encodeURIComponent(
        recipe.id
      )}`;
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.click();
      }
    });

    return card;
  }

  renderRecipeList(recipes) {
    this.recipeListEl.innerHTML = ""; // clear existing
    const fragment = document.createDocumentFragment();
    recipes.forEach((recipe) => {
      const card = this.createRecipeCard(recipe);
      fragment.appendChild(card);
    });
    this.recipeListEl.appendChild(fragment);
  }

  // Show count of filtered results
  renderFilterCount(count, total) {
    let countEl = document.getElementById("filter-result-count");
    if (!countEl) {
      countEl = document.createElement("p");
      countEl.id = "filter-result-count";
      countEl.className = "filters__result-count";
      this.recipeListEl.parentElement.insertBefore(countEl, this.recipeListEl);
    }
    countEl.textContent = `Showing ${count} of ${total} recipes`;
  }

  // Show empty state message
  renderEmptyState() {
    this.recipeListEl.innerHTML =
      '<p class="filters__empty-state">No recipes match your filter criteria.</p>';
  }
}
