import { StorageManager } from "./storage.js";
import { createRecipe } from "./recipe.js";

export class CRUDManager {
  constructor() {
    this.storage = new StorageManager();
  }

  /**
   * Create and save a new recipe, then redirect on success
   * @param {Object} formData
   * @returns {Promise<void>}
   */
  async createRecipe(formData) {
    const recipe = createRecipe(formData);
    if (!recipe) throw new Error("Invalid recipe data");
    this.storage.save(recipe);
  }
}
