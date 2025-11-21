import { beforeEach, describe, expect, test, vi } from "vitest";
import { CRUDManager } from "../src/js/crud.js";

// Mock window.alert globally for all tests
global.alert = vi.fn();

describe("CRUDManager integration", () => {
  let crud;

  beforeEach(() => {
    localStorage.clear();
    crud = new CRUDManager();
  });

  test("creates and retrieves a recipe", () => {
    const data = {
      title: "Test Recipe",
      description: "A test recipe for testing",
      ingredients: ["ingredient1", "ingredient2"],
      steps: ["step1", "step2"],
      prepTime: 10,
      cookTime: 20,
      difficulty: "easy",
      category: "veg", // Added category field
    };
    crud.createRecipe(data);
    const recipes = crud.storage.getAll();
    expect(recipes.length).toBe(1);
    expect(recipes[0].title).toBe("Test Recipe");
  });

  test("updates a recipe", () => {
    const data = {
      title: "Test Recipe",
      description: "A test recipe",
      ingredients: ["ing1"],
      steps: ["step1"],
      prepTime: 5,
      cookTime: 10,
      difficulty: "medium",
      category: "vegetarian", // Added category field
    };
    crud.createRecipe(data);
    const saved = crud.storage.getAll()[0];
    crud.updateRecipe(saved.id, { ...data, title: "Updated Recipe" });
    const updated = crud.storage.getAll()[0];
    expect(updated.title).toBe("Updated Recipe");
  });

  test("deletes a recipe", () => {
    const data = {
      title: "Delete Me",
      description: "To be deleted",
      ingredients: ["ing"],
      steps: ["step"],
      prepTime: 1,
      cookTime: 1,
      difficulty: "easy",
      category: "dessert", // Added category field
    };
    crud.createRecipe(data);
    const saved = crud.storage.getAll()[0];
    crud.deleteRecipe(saved.id);
    expect(crud.storage.getAll().length).toBe(0);
  });
});
