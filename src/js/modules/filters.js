"use strict";

import { DIFFICULTY_LEVELS } from "../../utils/constants.js";

export class FilterManager {
  constructor() {
    this.searchTerm = "";
    this.difficulty = DIFFICULTY_LEVELS.ALL;
    this.selectedCategories = [
      "veg",
      "vegetarian",
      "nonveg",
      "fruit",
      "dessert",
    ];
    this.prepTimeMin = 0;
    this.prepTimeMax = 120;
    this.cookTimeMin = 0;
    this.cookTimeMax = 180;
  }

  setSearchTerm(term) {
    this.searchTerm = term.toLowerCase().trim();
  }

  setDifficulty(difficulty) {
    if (Object.values(DIFFICULTY_LEVELS).includes(difficulty)) {
      this.difficulty = difficulty;
    } else {
      this.difficulty = DIFFICULTY_LEVELS.ALL;
    }
  }

  setCategories(categories) {
    if (Array.isArray(categories)) {
      this.selectedCategories = categories.map((c) => c.toLowerCase());
    } else {
      this.selectedCategories = [];
    }
  }

  setPrepTime(min, max = 120) {
    if (typeof min === "number" && min >= 0) {
      this.prepTimeMin = min;
    }
    if (typeof max === "number" && max >= 0) {
      this.prepTimeMax = max;
    }
  }

  setCookTime(min, max = 180) {
    if (typeof min === "number" && min >= 0) {
      this.cookTimeMin = min;
    }
    if (typeof max === "number" && max >= 0) {
      this.cookTimeMax = max;
    }
  }

  filter(recipes) {
    if (!Array.isArray(recipes)) return [];

    const difficultySet =
      this.difficulty === DIFFICULTY_LEVELS.ALL
        ? new Set(
            Object.values(DIFFICULTY_LEVELS).filter(
              (d) => d !== DIFFICULTY_LEVELS.ALL
            )
          )
        : new Set([this.difficulty]);

    return recipes.filter((recipe) => {
      if (
        this.searchTerm &&
        !(
          (recipe.title &&
            recipe.title.toLowerCase().includes(this.searchTerm)) ||
          (recipe.description &&
            recipe.description.toLowerCase().includes(this.searchTerm))
        )
      ) {
        // console.log(`Filtered by search: ${recipe.title}`);
        return false;
      }

      // Safe difficulty match
      const recipeDifficulty =
        typeof recipe.difficulty === "string"
          ? recipe.difficulty.toLowerCase()
          : "";
      if (!difficultySet.has(recipeDifficulty)) {
        // console.log(`Filtered by difficulty: ${recipe.title} (${recipe.difficulty})`);
        return false;
      }

      // Safe category match
      const recipeCategory =
        typeof recipe.category === "string"
          ? recipe.category.toLowerCase()
          : "";
      if (
        this.selectedCategories.length === 0 ||
        !this.selectedCategories.includes(recipeCategory)
      ) {
        // console.log(`Filtered by category: ${recipe.title} (${recipe.category})`);
        return false;
      }

      if (
        typeof recipe.prepTime === "number" &&
        (recipe.prepTime < this.prepTimeMin ||
          recipe.prepTime > this.prepTimeMax)
      ) {
        // console.log(`Filtered by prepTime: ${recipe.title} (${recipe.prepTime} min)`);
        return false;
      }

      if (
        typeof recipe.cookTime === "number" &&
        (recipe.cookTime < this.cookTimeMin ||
          recipe.cookTime > this.cookTimeMax)
      ) {
        // console.log(`Filtered by cookTime: ${recipe.title} (${recipe.cookTime} min)`);
        return false;
      }

      // console.log(`Included: ${recipe.title}`);
      return true;
    });
  }
}
