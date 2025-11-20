/**
 * Recipe Model - Class and Factory
 * @module recipe
 */

import { DIFFICULTY_LEVELS, VALIDATION_RULES } from "../utils/constants.js";

function generateUUID() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class Recipe {
  constructor({
    id = generateUUID(),
    title,
    description,
    ingredients,
    steps,
    prepTime,
    cookTime,
    difficulty,
    imageURL = "",
  } = {}) {
    this.id = id;
    this.title = title.trim();
    this.description = description.trim();
    this.ingredients = ingredients.map((i) => i.trim());
    this.steps = steps.map((s) => s.trim());
    this.prepTime = prepTime;
    this.cookTime = cookTime;
    this.difficulty = difficulty;
    this.imageURL = imageURL.trim();
    this.validate();
  }

  validate() {
    const rules = VALIDATION_RULES;

    if (
      typeof this.title !== "string" ||
      this.title.length < rules.title.minLength ||
      this.title.length > rules.title.maxLength
    ) {
      throw new Error(
        `Title must be between ${rules.title.minLength}-${rules.title.maxLength} characters`
      );
    }

    if (
      typeof this.description !== "string" ||
      this.description.length < rules.description.minLength ||
      this.description.length > rules.description.maxLength
    ) {
      throw new Error(
        `Description must be between ${rules.description.minLength}-${rules.description.maxLength} characters`
      );
    }

    if (
      !Array.isArray(this.ingredients) ||
      this.ingredients.length < rules.ingredientsMin ||
      this.ingredients.length > rules.ingredientsMax
    ) {
      throw new Error(
        `Ingredients must contain between ${rules.ingredientsMin} and ${rules.ingredientsMax} items`
      );
    }

    if (
      !Array.isArray(this.steps) ||
      this.steps.length < rules.stepsMin ||
      this.steps.length > rules.stepsMax
    ) {
      throw new Error(
        `Steps must contain between ${rules.stepsMin} and ${rules.stepsMax} items`
      );
    }

    if (
      typeof this.prepTime !== "number" ||
      this.prepTime < rules.prepTimeMin ||
      this.prepTime > rules.prepTimeMax
    ) {
      throw new Error(
        `Preparation time must be between ${rules.prepTimeMin} and ${rules.prepTimeMax} minutes`
      );
    }

    if (
      typeof this.cookTime !== "number" ||
      this.cookTime < rules.cookTimeMin ||
      this.cookTime > rules.cookTimeMax
    ) {
      throw new Error(
        `Cooking time must be between ${rules.cookTimeMin} and ${rules.cookTimeMax} minutes`
      );
    }

    if (!rules.difficultyValues.includes(this.difficulty)) {
      throw new Error(
        `Difficulty must be one of: ${rules.difficultyValues.join(", ")}`
      );
    }

    if (this.imageURL && !this._isValidURL(this.imageURL)) {
      throw new Error("Image URL is not valid");
    }
  }

  _isValidURL(url) {
    try {
      const u = new URL(url);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch (_) {
      return false;
    }
  }
}

export function createRecipe(data) {
  try {
    return new Recipe(data);
  } catch (error) {
    console.warn("Invalid recipe data:", error.message);
    return null;
  }
}
