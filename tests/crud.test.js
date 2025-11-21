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
      description: "This is a valid description with more than ten characters.",
      ingredients: ["1 cup flour", "2 eggs"],
      steps: ["Mix ingredients", "Bake at 350F for 20 minutes"],
      prepTime: 10,
      cookTime: 20,
      difficulty: "easy",
      imageURL: "", // optional
    };

    crud.createRecipe(data);
    const recipes = crud.storage.getAll();
    expect(recipes.length).toBe(1);
    expect(recipes[0].title).toBe("Test Recipe");
  });

  it("updates a recipe", () => {
    const data = {
      title: "Original Recipe",
      description: "A sufficiently long valid description for the update test.",
      ingredients: ["a"],
      steps: ["step1"],
      prepTime: 10,
      cookTime: 10,
      difficulty: "easy",
      imageURL: "",
    };
    crud.createRecipe(data);
    const saved = crud.storage.getAll()[0];
    crud.updateRecipe(saved.id, { ...data, title: "Updated Recipe" });
    const updated = crud.storage.getAll()[0];
    expect(updated.title).toBe("Updated Recipe");
  });

  it("deletes a recipe", () => {
    const data = {
      title: "To Delete",
      description:
        "Description long enough to pass validation and allow deletion.",
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
