"use strict";

import { DIFFICULTY_LEVELS } from "../../utils/constants.js";

export class FilterManager {
  constructor() {
    this.searchTerm = "";
    this.difficulty = DIFFICULTY_LEVELS.ALL;
    // Support multiple category selection (array of strings)
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

  // Set multiple selected categories
  setCategories(categories) {
    if (Array.isArray(categories)) {
      this.selectedCategories = categories;
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

  /**
   * Filters recipes based on current criteria.
   * @param {Array} recipes
   * @returns {Array} filtered recipes
   */
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
      // Search filter (title or description)
      if (
        this.searchTerm &&
        !(
          (recipe.title &&
            recipe.title.toLowerCase().includes(this.searchTerm)) ||
          (recipe.description &&
            recipe.description.toLowerCase().includes(this.searchTerm))
        )
      ) {
        return false;
      }

      // Difficulty filter
      if (!difficultySet.has(recipe.difficulty)) {
        return false;
      }

      // Category multi-select filter
      // If no categories selected => exclude all
      if (
        this.selectedCategories.length === 0 ||
        !this.selectedCategories.includes(recipe.category)
      ) {
        return false;
      }

      // Prep time min filter
      if (
        typeof recipe.prepTime === "number" &&
        recipe.prepTime < this.prepTimeMin
      ) {
        return false;
      }

      // Prep time max filter
      if (
        this.prepTimeMax !== null &&
        typeof recipe.prepTime === "number" &&
        recipe.prepTime > this.prepTimeMax
      ) {
        return false;
      }

      // Cook time min filter
      if (
        typeof recipe.cookTime === "number" &&
        recipe.cookTime < this.cookTimeMin
      ) {
        return false;
      }

      // Cook time max filter
      if (
        this.cookTimeMax !== null &&
        typeof recipe.cookTime === "number" &&
        recipe.cookTime > this.cookTimeMax
      ) {
        return false;
      }

      return true;
    });
  }
}
