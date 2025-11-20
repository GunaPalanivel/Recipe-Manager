import { StorageManager } from "./storage.js";
import { createRecipe } from "./recipe.js";

export class CRUDManager {
  constructor() {
    this.storage = new StorageManager();
  }

  /**
   * Create and save a new recipe
   * @param {Object} formData
   * @returns {Promise<void>}
   */
  async createRecipe(formData) {
    const recipe = createRecipe(formData);
    if (!recipe) throw new Error("Invalid recipe data");
    this.storage.save(recipe);
  }

  /**
   * Delete recipe by ID
   * @param {string} id
   * @returns {Promise<void>}
   */
  async deleteRecipe(id) {
    this.storage.remove(id);
  }

  /**
   * Update existing recipe by ID
   * @param {string} id
   * @param {Object} formData
   * @returns {Promise<void>}
   */
  async updateRecipe(id, formData) {
    const recipe = createRecipe({ id, ...formData });
    if (!recipe) throw new Error("Invalid recipe data");
    this.storage.save(recipe);
  }

  /**
   * Get recipe by ID
   * @param {string} id
   * @returns {Object|null}
   */
  getRecipeById(id) {
    const recipes = this.storage.getAll();
    return recipes.find((r) => r.id === id) || null;
  }
}
