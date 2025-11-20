/**
 * Validation Manager - Form validation logic
 *
 * @module validation
 * @description Client-side validation with real-time feedback
 */

"use strict";

/**
 * ValidationManager - Client-side form validation
 * @module validation
 */

import { VALIDATION_RULES } from "../utils/constants.js";

export class ValidationManager {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (!this.form) throw new Error(`Form with id ${formId} not found`);
    this.errors = new Map();
  }

  validateField(fieldName, value) {
    const rules = VALIDATION_RULES;
    let error = "";

    switch (fieldName) {
      case "title":
        if (!value || value.trim().length < rules.title.minLength) {
          error = `Title must be at least ${rules.title.minLength} characters`;
        } else if (value.trim().length > rules.title.maxLength) {
          error = `Title must not exceed ${rules.title.maxLength} characters`;
        }
        break;

      case "description":
        if (!value || value.trim().length < rules.description.minLength) {
          error = `Description must be at least ${rules.description.minLength} characters`;
        } else if (value.trim().length > rules.description.maxLength) {
          error = `Description must not exceed ${rules.description.maxLength} characters`;
        }
        break;

      case "prepTime":
      case "cookTime":
        const num = parseInt(value, 10);
        if (isNaN(num) || num < rules.prepTimeMin || num > rules.prepTimeMax) {
          error = `Time must be between ${rules.prepTimeMin} and ${rules.prepTimeMax} minutes`;
        }
        break;

      case "difficulty":
        if (!rules.difficultyValues.includes(value)) {
          error = "Please select a valid difficulty level";
        }
        break;

      case "imageURL":
        if (value && !this.isValidURL(value)) {
          error = "Please enter a valid URL (http:// or https://)";
        }
        break;

      default:
        break;
    }

    if (error) {
      this.errors.set(fieldName, error);
      return false;
    } else {
      this.errors.delete(fieldName);
      return true;
    }
  }

  validateIngredients(ingredients) {
    const rules = VALIDATION_RULES;
    if (
      !Array.isArray(ingredients) ||
      ingredients.length < rules.ingredientsMin
    ) {
      this.errors.set(
        "ingredients",
        `At least ${rules.ingredientsMin} ingredient required`
      );
      return false;
    } else if (ingredients.length > rules.ingredientsMax) {
      this.errors.set(
        "ingredients",
        `Maximum ${rules.ingredientsMax} ingredients allowed`
      );
      return false;
    }
    this.errors.delete("ingredients");
    return true;
  }

  validateSteps(steps) {
    const rules = VALIDATION_RULES;
    if (!Array.isArray(steps) || steps.length < rules.stepsMin) {
      this.errors.set("steps", `At least ${rules.stepsMin} step required`);
      return false;
    } else if (steps.length > rules.stepsMax) {
      this.errors.set("steps", `Maximum ${rules.stepsMax} steps allowed`);
      return false;
    }
    this.errors.delete("steps");
    return true;
  }

  displayFieldError(fieldName, errorMessage) {
    const errorEl = document.getElementById(`${fieldName}-error`);
    const inputEl =
      document.getElementById(fieldName) ||
      document.querySelector(`[name="${fieldName}"]`);

    if (errorEl) {
      errorEl.textContent = errorMessage;
    }
    if (inputEl) {
      if (errorMessage) {
        inputEl.classList.add("invalid");
        inputEl.setAttribute("aria-invalid", "true");
      } else {
        inputEl.classList.remove("invalid");
        inputEl.setAttribute("aria-invalid", "false");
      }
    }
  }

  clearFieldError(fieldName) {
    this.displayFieldError(fieldName, "");
  }

  isValidURL(url) {
    try {
      const u = new URL(url);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  validateAll(formData) {
    this.errors.clear();

    this.validateField("title", formData.title);
    this.validateField("description", formData.description);
    this.validateField("prepTime", formData.prepTime);
    this.validateField("cookTime", formData.cookTime);
    this.validateField("difficulty", formData.difficulty);
    this.validateField("imageURL", formData.imageURL);
    this.validateIngredients(formData.ingredients);
    this.validateSteps(formData.steps);

    return this.errors.size === 0;
  }
}
