import { describe, it, expect, beforeEach } from "vitest";
import { CRUDManager } from "../src/js/crud.js";

describe("CRUDManager integration", () => {
  let crud;

  beforeEach(() => {
    crud = new CRUDManager();
    localStorage.clear();
  });

  it("creates and retrieves a recipe", () => {
    const data = {
      title: "Test Recipe",
      description: "Desc",
      ingredients: ["a", "b"],
      steps: ["step1"],
      prepTime: 10,
      cookTime: 20,
      difficulty: "easy",
      imageURL: "",
    };
    crud.createRecipe(data);
    const recipes = crud.storage.getAll();
    expect(recipes.length).toBe(1);
    expect(recipes[0].title).toBe("Test Recipe");
  });

  it("updates a recipe", () => {
    const data = {
      title: "Original",
      description: "Desc",
      ingredients: ["a"],
      steps: ["step1"],
      prepTime: 10,
      cookTime: 10,
      difficulty: "easy",
      imageURL: "",
    };
    crud.createRecipe(data);
    const saved = crud.storage.getAll()[0];
    crud.updateRecipe(saved.id, { ...data, title: "Updated" });
    const updated = crud.storage.getAll()[0];
    expect(updated.title).toBe("Updated");
  });

  it("deletes a recipe", () => {
    const data = {
      title: "To Delete",
      description: "Desc",
      ingredients: ["a"],
      steps: ["step1"],
      prepTime: 10,
      cookTime: 10,
      difficulty: "easy",
      imageURL: "",
    };
    crud.createRecipe(data);
    const saved = crud.storage.getAll()[0];
    crud.deleteRecipe(saved.id);
    expect(crud.storage.getAll().length).toBe(0);
  });
});
