"use strict";

import { StorageManager } from "./modules/storage.js";
import { UIManager } from "./modules/ui.js";
import { FilterManager } from "./modules/filters.js";
import { sampleRecipes } from "../data/sample-recipes.js";
import { STORAGE_KEY } from "../utils/constants.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize storage and seed sample data if none exists
  const storage = new StorageManager();
  storage.seed(sampleRecipes);

  // 2. Create UI and filter managers
  const uiManager = new UIManager({ recipeListId: "recipe-list" });
  const filterManager = new FilterManager();

  // 3. Check all category checkboxes by default for initial full display
  Array.from(document.querySelectorAll(".filters__category")).forEach(
    (cb) => (cb.checked = true)
  );

  // 4. Sync filterManager's selected categories to all categories for broad match
  filterManager.setCategories([
    "veg",
    "vegetarian",
    "nonveg",
    "fruit",
    "dessert",
  ]);

  // 5. For debugging convenience, expose managers on window
  window.filterManager = filterManager;
  window.uiManager = uiManager;

  // 6. Helper to retrieve all recipes safely from storage
  function getAllRecipes() {
    return storage.getAll();
  }

  // 7. Applies filters to all recipes and updates UI
  function applyFilters() {
    const allRecipes = getAllRecipes();
    const filtered = filterManager.filter(allRecipes);

    if (filtered.length === 0) {
      uiManager.renderEmptyState();
    } else {
      uiManager.renderRecipeList(filtered);
    }
    uiManager.renderFilterCount(filtered.length, allRecipes.length);
  }

  // 8. Call once on page load for initial render
  applyFilters();

  // 9. Hook up event listeners on filter inputs/buttons

  // Search Input
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      filterManager.setSearchTerm(event.target.value);
      applyFilters();
    });
  }

  // Difficulty Dropdown
  const difficultyFilter = document.getElementById("difficulty-filter");
  if (difficultyFilter) {
    difficultyFilter.addEventListener("change", (event) => {
      filterManager.setDifficulty(event.target.value);
      applyFilters();
    });
  }

  // Category Checkboxes
  Array.from(document.querySelectorAll(".filters__category")).forEach((cb) => {
    cb.addEventListener("change", () => {
      const selectedCategories = Array.from(
        document.querySelectorAll(".filters__category:checked")
      ).map((cb) => cb.value);
      filterManager.setCategories(selectedCategories);
      applyFilters();
    });
  });

  // Prep Time sliders and display updates
  const prepTimeMinSlider = document.getElementById("prep-time-min");
  const prepTimeMaxSlider = document.getElementById("prep-time-max");
  const prepTimeMinValue = document.getElementById("prep-time-min-value");
  const prepTimeMaxValue = document.getElementById("prep-time-max-value");

  if (prepTimeMinSlider && prepTimeMinValue) {
    prepTimeMinSlider.addEventListener("input", (event) => {
      const value = Number(event.target.value);
      prepTimeMinValue.textContent = value;
      filterManager.setPrepTime(value, filterManager.prepTimeMax);
      applyFilters();
    });
  }

  if (prepTimeMaxSlider && prepTimeMaxValue) {
    prepTimeMaxSlider.addEventListener("input", (event) => {
      const value = Number(event.target.value);
      prepTimeMaxValue.textContent = value;
      filterManager.setPrepTime(filterManager.prepTimeMin, value);
      applyFilters();
    });
  }

  // Cook Time sliders and display updates
  const cookTimeMinSlider = document.getElementById("cook-time-min");
  const cookTimeMaxSlider = document.getElementById("cook-time-max");
  const cookTimeMinValue = document.getElementById("cook-time-min-value");
  const cookTimeMaxValue = document.getElementById("cook-time-max-value");

  if (cookTimeMinSlider && cookTimeMinValue) {
    cookTimeMinSlider.addEventListener("input", (event) => {
      const value = Number(event.target.value);
      cookTimeMinValue.textContent = value;
      filterManager.setCookTime(value, filterManager.cookTimeMax);
      applyFilters();
    });
  }

  if (cookTimeMaxSlider && cookTimeMaxValue) {
    cookTimeMaxSlider.addEventListener("input", (event) => {
      const value = Number(event.target.value);
      cookTimeMaxValue.textContent = value;
      filterManager.setCookTime(filterManager.cookTimeMin, value);
      applyFilters();
    });
  }

  // 10. Optional debug logs for storage state and recipe count
  // console.log(
  //   "Seeded recipes stored under " + STORAGE_KEY + ":",
  //   localStorage.getItem(STORAGE_KEY)
  // );
  // console.log("Number of recipes loaded:", getAllRecipes().length);
});
