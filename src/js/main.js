/**
 * Recipe Manager - Main Entry Point
 *
 * @module main
 * @description Application entry point for the home page
 *
 * Performance target: First Contentful Paint < 1.5s
 *
 * Author: Guna Palanivel
 * Version: 1.0.0
 */

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
 * Main application function initializes storage, UI, and filters,
 * and manages the live search and filter functionality with debouncing.
 */
function main() {
  const storage = new StorageManager();
  storage.seed(sampleRecipes); // Seed initial recipes if storage empty

  const uiManager = new UIManager({ recipeListId: "recipe-list" });
  const filterManager = new FilterManager();

  const searchInput = document.getElementById("search-input");
  const difficultyFilter = document.getElementById("difficulty-filter");

  /**
   * Apply filters to all recipes and update the UI accordingly.
   */
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

  // Debounce filter application for performance on typing
  const debouncedApplyFilters = debounce(applyFilters, 300);

  // Event listener for live search input
  searchInput.addEventListener("input", (event) => {
    filterManager.setSearchTerm(event.target.value);
    debouncedApplyFilters();
  });

  // Event listener for difficulty dropdown filter
  difficultyFilter.addEventListener("change", (event) => {
    filterManager.setDifficulty(event.target.value);
    applyFilters();
  });

  // Initial render on page load
  applyFilters();
}

// Run main after DOM is fully loaded
document.addEventListener("DOMContentLoaded", main);
