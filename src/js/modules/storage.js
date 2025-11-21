/**
 * StorageManager - localStorage wrapper with caching and error handling
 * @module storage
 */

import { STORAGE_KEY } from "../../utils/constants.js";

export class StorageManager {
  constructor() {
    this.cache = new Map();
    this.isCacheInitialized = false;
  }

  // (Inside StorageManager class)

  _initCache() {
    if (this.isCacheInitialized) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this.cache = new Map();
      } else {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            this.cache = new Map(parsed.map((recipe) => [recipe.id, recipe]));
          } else {
            throw new Error("Invalid data format");
          }
        } catch (parseError) {
          console.warn("Corrupted localStorage data detected, clearing...");
          localStorage.removeItem(STORAGE_KEY);
          this.cache = new Map();
        }
      }
    } catch (error) {
      console.error("localStorage access error:", error);
      this.cache = new Map();
    }
    this.isCacheInitialized = true;
  }

  _persistCache() {
    try {
      const data = JSON.stringify(Array.from(this.cache.values()));
      localStorage.setItem(STORAGE_KEY, data);
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        alert(
          "Storage limit exceeded. Please delete some recipes before adding new ones."
        );
      } else {
        console.error("Error saving to localStorage:", error);
        throw error;
      }
    }
  }

  getAll() {
    this._initCache();
    return Array.from(this.cache.values());
  }

  _persistCache() {
    const startMark = "storage_set_start";
    performance.mark(startMark);

    try {
      const data = JSON.stringify(Array.from(this.cache.values()));
      localStorage.setItem(STORAGE_KEY, data);
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        alert(
          "Storage limit exceeded. Please delete some recipes before adding new ones."
        );
      } else {
        console.error("localStorage setItem error:", error);
        throw error;
      }
    }

    performance.mark("storage_set_end");
    performance.measure("storage_set_duration", startMark, "storage_set_end");
  }

  save(recipe) {
    if (!recipe || !recipe.id) {
      throw new Error("Recipe must have an id");
    }
    this._initCache();
    this.cache.set(recipe.id, recipe);
    this._persistCache();
  }

  remove(id) {
    if (!id) throw new Error("ID is required to delete recipe");
    this._initCache();
    this.cache.delete(id);
    this._persistCache();
  }

  clear() {
    this.cache.clear();
    localStorage.removeItem(STORAGE_KEY);
  }

  seed(recipes) {
    this._initCache();
    if (this.cache.size === 0 && Array.isArray(recipes) && recipes.length > 0) {
      recipes.forEach((recipe) => {
        if (recipe.id) {
          this.cache.set(recipe.id, recipe);
        }
      });
      this._persistCache();
    }
  }
}
