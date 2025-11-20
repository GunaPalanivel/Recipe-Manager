/**
 * UI Manager - DOM manipulation and rendering
 *
 * @module ui
 * @description Manages all UI updates with performance optimization
 *
 * Performance targets:
 * - Render time < 16ms (60fps)
 * - Use DocumentFragment for batch updates
 * - Minimize reflows and repaints
 */

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
    card.tabIndex = 0;
    card.setAttribute("aria-label", `Recipe: ${recipe.title}`);

    const img = document.createElement("img");
    img.className = "recipe-card__image";
    img.alt = recipe.title;
    img.setAttribute(
      "data-src",
      recipe.imageURL || "/src/assets/images/placeholder.jpg"
    );
    img.src = "/src/assets/images/placeholder.jpg";
    this.intersectionObserver.observe(img);

    const content = document.createElement("div");
    content.className = "recipe-card__content";

    const title = document.createElement("h2");
    title.className = "recipe-card__title";
    title.textContent = recipe.title;

    const description = document.createElement("p");
    description.className = "recipe-card__description";
    description.textContent = recipe.description;

    const meta = document.createElement("div");
    meta.className = "recipe-card__meta";

    const prepCook = document.createElement("span");
    prepCook.textContent = `Prep: ${recipe.prepTime} min | Cook: ${recipe.cookTime} min`;

    const difficulty = document.createElement("span");
    difficulty.className = `recipe-card__difficulty recipe-card__difficulty--${recipe.difficulty}`;
    difficulty.textContent = recipe.difficulty;

    meta.append(prepCook, difficulty);
    content.append(title, description, meta);

    card.append(img, content);

    // Add click handler for navigation
    card.addEventListener("click", () => {
      window.location.href = `/pages/detail.html?id=${encodeURIComponent(recipe.id)}`;
    });
    // Keyboard navigation
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.click();
      }
    });

    return card;
  }

  renderRecipeList(recipes) {
    // Batch DOM insertion to optimize reflow
    this.recipeListEl.innerHTML = ""; // clear existing
    const fragment = document.createDocumentFragment();
    recipes.forEach((recipe) => {
      const card = this.createRecipeCard(recipe);
      fragment.appendChild(card);
    });
    this.recipeListEl.appendChild(fragment);
  }
}
