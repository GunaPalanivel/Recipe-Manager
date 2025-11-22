/**
 * @jest-environment jsdom
 */

import { describe, it, expect, beforeEach } from "vitest"; // or jest imports
import { FilterManager } from "../src/js/modules/filters.js";

const RECIPES = [
  {
    id: "1",
    title: "Tomato Soup",
    description: "Soup",
    difficulty: "easy",
    category: "veg",
    prepTime: 10,
    cookTime: 30,
  },
  {
    id: "2",
    title: "Beef Stirfry",
    description: "Meaty",
    difficulty: "medium",
    category: "nonveg",
    prepTime: 20,
    cookTime: 15,
  },
  {
    id: "3",
    title: "Fruit Salad",
    description: "Fresh",
    difficulty: "easy",
    category: "fruit",
    prepTime: 5,
    cookTime: 0,
  },
  {
    id: "4",
    title: "Veg Lasagna",
    description: "Cheesy",
    difficulty: "medium",
    category: "vegetarian",
    prepTime: 30,
    cookTime: 60,
  },
  {
    id: "5",
    title: "Baked Alaska",
    description: "Dessert",
    difficulty: "hard",
    category: "dessert",
    prepTime: 60,
    cookTime: 5,
  },
];

describe("FilterManager", () => {
  let filter;

  beforeEach(() => {
    filter = new FilterManager();
  });

  it("filters by search term in title and description", () => {
    filter.setSearchTerm("soup");
    let result = filter.filter(RECIPES);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Tomato Soup");

    filter.setSearchTerm("fruit");
    result = filter.filter(RECIPES);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Fruit Salad");

    filter.setSearchTerm("cheesy");
    result = filter.filter(RECIPES);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Veg Lasagna");
  });

  it("filters by difficulty correctly", () => {
    filter.setDifficulty("easy");
    expect(filter.filter(RECIPES).every((r) => r.difficulty === "easy")).toBe(
      true
    );

    filter.setDifficulty("medium");
    expect(filter.filter(RECIPES).every((r) => r.difficulty === "medium")).toBe(
      true
    );

    filter.setDifficulty("hard");
    expect(filter.filter(RECIPES).every((r) => r.difficulty === "hard")).toBe(
      true
    );
  });

  it("filters by multiple categories", () => {
    filter.setCategories(["veg", "dessert"]);
    const filtered = filter.filter(RECIPES);
    const categories = filtered.map((r) => r.category);
    expect(categories).toEqual(expect.arrayContaining(["veg", "dessert"]));
    expect(filtered).toHaveLength(2);
  });

  test("filters by prep time range", () => {
    filter.setPrepTime(0, 15); // min=0, max=15
    const result = filter.filter(RECIPES);
    expect(result.every((r) => r.prepTime >= 0 && r.prepTime <= 15)).toBe(true);
  });

  test("filters by cook time range", () => {
    filter.setCookTime(0, 10); // min=0, max=10
    const result = filter.filter(RECIPES);
    expect(result.every((r) => r.cookTime >= 0 && r.cookTime <= 10)).toBe(true);
  });

  it("chains all filters", () => {
    filter.setSearchTerm("vegetable");
    filter.setDifficulty("medium");
    filter.setCategories(["vegetarian", "veg"]);
    filter.setPrepTime(30, 30);
    filter.setCookTime(60, 60);

    const result = filter.filter(RECIPES);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Veg Lasagna");
  });

  it("returns all recipes when no filters applied", () => {
    const all = filter.filter(RECIPES);
    expect(all).toHaveLength(RECIPES.length);
  });

  it("returns zero recipes if categories empty", () => {
    filter.setCategories([]);
    expect(filter.filter(RECIPES)).toHaveLength(0);
  });

  test("filters correctly on exact boundary values for sliders", () => {
    filter.setPrepTime(10, 10); // Exactly 10
    filter.setCookTime(30, 30); // Exactly 30
    const result = filter.filter(RECIPES);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Tomato Soup");
  });
});
