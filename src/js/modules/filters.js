/**
 * Filter Manager - Search and filter logic
 *
 * @module filters
 * @description Strategy pattern for filtering recipes
 *
 * Big O Analysis:
 * - Search: O(n) - Linear scan through recipes
 * - Filter by difficulty: O(n) with early termination
 * - Combined filters: O(n) - Single pass with short-circuit
 */

"use strict";

/**
 * FilterManager - Implements search and filter logic
 * Uses Strategy pattern for extendability
 */

import { DIFFICULTY_LEVELS } from "../utils/constants.js";

export class FilterManager {
  constructor() {
    this.searchTerm = "";
    this.difficulty = DIFFICULTY_LEVELS.ALL;
    this.maxPrepTime = null; // null means no filter
  }

  setSearchTerm(term) {
    this.searchTerm = term.trim().toLowerCase();
  }

  setDifficulty(level) {
    if (Object.values(DIFFICULTY_LEVELS).includes(level)) {
      this.difficulty = level;
    } else {
      this.difficulty = DIFFICULTY_LEVELS.ALL;
    }
  }

  setMaxPrepTime(minutes) {
    if (typeof minutes === "number" && minutes > 0) {
      this.maxPrepTime = minutes;
    } else {
      this.maxPrepTime = null;
    }
  }

  /**
   * Filters a given list of recipes by current criteria
   * @param {Array} recipes
   * @returns {Array} filtered recipes
   */
  filter(recipes) {
    if (!Array.isArray(recipes)) return [];

    const difficultySet = new Set(
      this.difficulty === DIFFICULTY_LEVELS.ALL
        ? Object.values(DIFFICULTY_LEVELS).filter(
            (d) => d !== DIFFICULTY_LEVELS.ALL
          )
        : [this.difficulty]
    );

    // Filter pipeline: search -> difficulty -> max prep time
    return recipes.filter((recipe) => {
      // Search filter: title includes searchTerm (case insensitive)
      if (
        this.searchTerm &&
        !recipe.title.toLowerCase().includes(this.searchTerm)
      ) {
        return false;
      }

      // Difficulty filter: O(1) membership check
      if (!difficultySet.has(recipe.difficulty)) {
        return false;
      }

      // Max prep time filter
      if (this.maxPrepTime !== null && recipe.prepTime > this.maxPrepTime) {
        return false;
      }

      return true;
    });
  }
}
