/**
 * Application Constants
 *
 * @module constants
 * @description Centralized configuration and constants
 */

"use strict";

/**
 * Application Constants
 * @module constants
 */

export const STORAGE_KEY = "recipes";

export const DIFFICULTY_LEVELS = Object.freeze({
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  ALL: "all",
});

export const VALIDATION_RULES = {
  title: { minLength: 3, maxLength: 100, required: true },
  description: { minLength: 10, maxLength: 500, required: true },
  ingredientsMin: 1,
  ingredientsMax: 50,
  stepsMin: 1,
  stepsMax: 20,
  prepTimeMin: 1,
  prepTimeMax: 999,
  cookTimeMin: 1,
  cookTimeMax: 999,
  difficultyValues: Object.values(DIFFICULTY_LEVELS).filter(
    (level) => level !== DIFFICULTY_LEVELS.ALL
  ),
};
