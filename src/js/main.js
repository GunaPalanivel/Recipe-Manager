"use strict";

// Import global CSS so Vite bundles all styles
import "../css/main.css";
import "../css/components/card.css";
import "../css/components/filters.css";
import "../css/components/form.css";
import "../css/components/modal.css";
import "../css/utils/reset.css";
import "../css/utils/variables.css";

// Wait for DOM loaded to run page code
document.addEventListener("DOMContentLoaded", () => {
  // --- Home page logic ---
  if (document.getElementById("recipe-list")) {
    // Home page JS code only runs if recipe-list exists!
    import("./modules/storage.js").then(({ StorageManager }) => {
      import("./modules/ui.js").then(({ UIManager }) => {
        import("./modules/filters.js").then(({ FilterManager }) => {
          import("../data/sample-recipes.js").then(({ sampleRecipes }) => {
            import("../utils/constants.js").then(({ STORAGE_KEY }) => {
              // Init storage and managers
              const storage = new StorageManager();
              storage.seed(sampleRecipes);

              const uiManager = new UIManager({ recipeListId: "recipe-list" });
              const filterManager = new FilterManager();

              // Default states
              Array.from(
                document.querySelectorAll(".filters__category")
              ).forEach((cb) => (cb.checked = true));
              filterManager.setCategories([
                "veg",
                "vegetarian",
                "nonveg",
                "fruit",
                "dessert",
              ]);
              window.filterManager = filterManager;
              window.uiManager = uiManager;

              // Main logic
              function getAllRecipes() {
                return storage.getAll();
              }
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
              applyFilters();

              // Event: search, difficulty, categories, sliders
              const searchInput = document.getElementById("search-input");
              if (searchInput) {
                searchInput.addEventListener("input", (event) => {
                  filterManager.setSearchTerm(event.target.value);
                  applyFilters();
                });
              }
              const difficultyFilter =
                document.getElementById("difficulty-filter");
              if (difficultyFilter) {
                difficultyFilter.addEventListener("change", (event) => {
                  filterManager.setDifficulty(event.target.value);
                  applyFilters();
                });
              }
              Array.from(
                document.querySelectorAll(".filters__category")
              ).forEach((cb) => {
                cb.addEventListener("change", () => {
                  const selectedCategories = Array.from(
                    document.querySelectorAll(".filters__category:checked")
                  ).map((cb) => cb.value);
                  filterManager.setCategories(selectedCategories);
                  applyFilters();
                });
              });
              const prepTimeMinSlider =
                document.getElementById("prep-time-min");
              const prepTimeMaxSlider =
                document.getElementById("prep-time-max");
              const prepTimeMinValue = document.getElementById(
                "prep-time-min-value"
              );
              const prepTimeMaxValue = document.getElementById(
                "prep-time-max-value"
              );
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
              const cookTimeMinSlider =
                document.getElementById("cook-time-min");
              const cookTimeMaxSlider =
                document.getElementById("cook-time-max");
              const cookTimeMinValue = document.getElementById(
                "cook-time-min-value"
              );
              const cookTimeMaxValue = document.getElementById(
                "cook-time-max-value"
              );
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
            });
          });
        });
      });
    });
  }

  // --- Form page logic ---
  if (document.getElementById("recipe-form")) {
    import("./form.js");
  }

  // --- Detail page logic ---
  if (document.querySelector(".recipe-detail")) {
    import("./detail.js");
  }
});
