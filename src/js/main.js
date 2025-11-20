/**
 * Recipe Manager - Main Entry Point
 *
 * @module main
 * @description Application entry point for the home page
 *
 * Performance target: First Contentful Paint < 1.5s
 *
 * @author Your Name
 * @version 1.0.0
 */

"use strict";

// Imports will be added in subsequent phases
import { StorageManager } from "./modules/storage.js";
import { UIManager } from "./modules/ui.js";
import { sampleRecipes } from "./data/sample-recipes.js";

const storage = new StorageManager();
storage.seed(sampleRecipes);

const uiManager = new UIManager({ recipeListId: "recipe-list" });

function loadAndRender() {
  const recipes = storage.getAll();
  uiManager.renderRecipeList(recipes);
}

loadAndRender();
