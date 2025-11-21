"use strict";

// Register global error handler first
import { errorHandler } from "./modules/errorHandler.js";
errorHandler; // instantiate to register global handlers

import { StorageManager } from "./modules/storage.js";
import { UIManager } from "./modules/ui.js";
import { FilterManager } from "./modules/filters.js";
import { debounce } from "../utils/helpers.js";
import { sampleRecipes } from "../data/sample-recipes.js";

/**
 * Custom UIManager extension to override card rendering to include category badges
 */
class CustomUIManager extends UIManager {
  renderRecipeList(recipes) {
    const container = this.recipeListEl;
    if (!container) {
      console.error("Recipe list container element not found");
      return;
    }
    container.innerHTML = ""; // clear existing

    recipes.forEach((recipe) => {
      const categoryLabel = recipe.category
        ? recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)
        : "";

      const card = document.createElement("article");
      card.className = "recipe-card";
      card.tabIndex = 0;
      card.setAttribute("role", "region");
      card.setAttribute("aria-label", `Recipe: ${recipe.title}`);

      const imgWrap = document.createElement("div");
      imgWrap.className = "recipe-card__image-wrapper";

      const img = document.createElement("img");
      img.className = "recipe-card__image";
      img.alt = recipe.title;
      img.setAttribute(
        "data-src",
        recipe.imageURL || "/src/assets/images/placeholder.jpg"
      );
      img.src = "/src/assets/images/placeholder.jpg";
      img.onerror = () => {
        img.src = "/src/assets/images/placeholder.jpg";
      };
      imgWrap.appendChild(img);

      const content = document.createElement("div");
      content.className = "recipe-card__content";

      const title = document.createElement("h3");
      title.className = "recipe-card__title";
      title.textContent = recipe.title;

      if (categoryLabel) {
        const categoryBadge = document.createElement("span");
        categoryBadge.className = `badge badge--category badge--${recipe.category}`;
        categoryBadge.setAttribute("aria-label", `Category: ${categoryLabel}`);
        categoryBadge.textContent = categoryLabel;
        title.appendChild(categoryBadge);
      }

      const description = document.createElement("p");
      description.className = "recipe-card__description";
      description.textContent = recipe.description;

      const meta = document.createElement("p");
      meta.className = "recipe-card__meta";
      meta.textContent = `Prep: ${recipe.prepTime} mins | Cook: ${recipe.cookTime} mins | Difficulty: ${recipe.difficulty}`;

      content.append(title, description, meta);
      card.append(imgWrap, content);

      card.addEventListener("click", () => {
        window.location.href = `/pages/detail.html?id=${encodeURIComponent(recipe.id)}`;
      });
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          card.click();
        }
      });

      container.appendChild(card);

      if (this.intersectionObserver) {
        this.intersectionObserver.observe(img);
      }
    });
  }
}

function main() {
  const storage = new StorageManager();
  storage.seed(sampleRecipes);

  const uiManager = new CustomUIManager({ recipeListId: "recipe-list" });
  const filterManager = new FilterManager();

  // DOM elements
  const searchInput = document.getElementById("search-input");
  const difficultyFilter = document.getElementById("difficulty-filter");

  const categoryCheckboxes = Array.from(
    document.querySelectorAll(".filters__category")
  );

  // Sliders for prep and cook times
  const prepTimeMinSlider = document.getElementById("prep-time-min");
  const prepTimeMaxSlider = document.getElementById("prep-time-max");
  const prepTimeMinValue = document.getElementById("prep-time-min-value");
  const prepTimeMaxValue = document.getElementById("prep-time-max-value");

  const cookTimeMinSlider = document.getElementById("cook-time-min");
  const cookTimeMaxSlider = document.getElementById("cook-time-max");
  const cookTimeMinValue = document.getElementById("cook-time-min-value");
  const cookTimeMaxValue = document.getElementById("cook-time-max-value");

  /** Helper to get checked categories array */
  function getSelectedCategories() {
    return categoryCheckboxes.filter((cb) => cb.checked).map((cb) => cb.value);
  }

  /** Core filter application */
  function applyFilters() {
    const allRecipes = storage.getAll();
    const filtered = filterManager.filter(allRecipes);
    if (filtered.length === 0) {
      uiManager.renderEmptyState();
    } else {
      uiManager.renderRecipeList(filtered);
    }
    uiManager.renderFilterCount(filtered.length, allRecipes.length);

    // TODO: Update an "Active Filters" summary here for accessibility & UX
  }

  const debouncedApplyFilters = debounce(applyFilters, 300);

  // Initialize slider values UI on load to match FilterManager defaults
  function initSliders() {
    if (prepTimeMinSlider && prepTimeMinValue) {
      prepTimeMinSlider.value = filterManager.prepTimeMin;
      prepTimeMinValue.textContent = filterManager.prepTimeMin;
    }
    if (prepTimeMaxSlider && prepTimeMaxValue) {
      prepTimeMaxSlider.value = filterManager.prepTimeMax;
      prepTimeMaxValue.textContent = filterManager.prepTimeMax;
    }
    if (cookTimeMinSlider && cookTimeMinValue) {
      cookTimeMinSlider.value = filterManager.cookTimeMin;
      cookTimeMinValue.textContent = filterManager.cookTimeMin;
    }
    if (cookTimeMaxSlider && cookTimeMaxValue) {
      cookTimeMaxSlider.value = filterManager.cookTimeMax;
      cookTimeMaxValue.textContent = filterManager.cookTimeMax;
    }
  }

  initSliders();

  // Search input listener
  searchInput.addEventListener("input", (event) => {
    filterManager.setSearchTerm(event.target.value);
    debouncedApplyFilters();
  });

  // Difficulty dropdown
  difficultyFilter.addEventListener("change", (event) => {
    filterManager.setDifficulty(event.target.value);
    applyFilters();
  });

  // Category checkboxes event
  categoryCheckboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      filterManager.setCategories(getSelectedCategories());
      applyFilters();
    });
  });

  // Debounced slider input handlers for performance
  const debouncedPrepMin = debounce((value) => {
    filterManager.setPrepTime(value);
    applyFilters();
  }, 250);

  const debouncedPrepMax = debounce((value) => {
    // Assuming you add setPrepTimeMax to FilterManager for max slider support
    if (filterManager.setPrepTimeMax) filterManager.setPrepTimeMax(value);
    applyFilters();
  }, 250);

  const debouncedCookMin = debounce((value) => {
    filterManager.setCookTime(value);
    applyFilters();
  }, 250);

  const debouncedCookMax = debounce((value) => {
    // Assuming you add setCookTimeMax to FilterManager for max slider support
    if (filterManager.setCookTimeMax) filterManager.setCookTimeMax(value);
    applyFilters();
  }, 250);

  // Prep Time Min slider
  if (prepTimeMinSlider && prepTimeMinValue) {
    prepTimeMinSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      prepTimeMinValue.textContent = val;
      debouncedPrepMin(val);
    });
  }

  // Prep Time Max slider
  if (prepTimeMaxSlider && prepTimeMaxValue) {
    prepTimeMaxSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      prepTimeMaxValue.textContent = val;
      debouncedPrepMax(val);
    });
  }

  // Cook Time Min slider
  if (cookTimeMinSlider && cookTimeMinValue) {
    cookTimeMinSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      cookTimeMinValue.textContent = val;
      debouncedCookMin(val);
    });
  }

  // Cook Time Max slider
  if (cookTimeMaxSlider && cookTimeMaxValue) {
    cookTimeMaxSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      cookTimeMaxValue.textContent = val;
      debouncedCookMax(val);
    });
  }

  // Initial render
  applyFilters();
}

document.addEventListener("DOMContentLoaded", main);
