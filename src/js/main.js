/**
 * Recipe Manager - Main Entry Point
 *
 * @module main
 * @description Application entry point for the home page
 *
 * Performance target: First Contentful Paint < 1.5s
 *
 * @author Guna Palanivel
 * @version 1.0.0
 */

"use strict";

// Imports will be added in subsequent phases
import { StorageManager } from "./modules/storage.js";
import { UIManager } from "./modules/ui.js";
import { FilterManager } from "./modules/filters.js";
import { debounce } from "./utils/helpers.js";
import { sampleRecipes } from "./data/sample-recipes.js";

const storage = new StorageManager();
storage.seed(sampleRecipes);

const uiManager = new UIManager({ recipeListId: "recipe-list" });
const filterManager = new FilterManager();

const searchInput = document.getElementById("search-input");
const difficultyFilter = document.getElementById("difficulty-filter");

function applyFilters() {
  const allRecipes = storage.getAll();
  const filtered = filterManager.filter(allRecipes);
  if (filtered.length === 0) {
    uiManager.renderEmptyState();
  } else {
    uiManager.renderRecipeList(filtered);
  }
  uiManager.renderFilterCount(filtered.length, allRecipes.length);
}

const debouncedApplyFilters = debounce(applyFilters, 300);

searchInput.addEventListener("input", (event) => {
  filterManager.setSearchTerm(event.target.value);
  debouncedApplyFilters();
});

difficultyFilter.addEventListener("change", (event) => {
  filterManager.setDifficulty(event.target.value);
  applyFilters();
});

// Initial render
applyFilters();
