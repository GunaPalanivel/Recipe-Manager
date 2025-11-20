/**
 * Filter Tests
 *
 * @jest-environment jsdom
 */

/**
 * FilterManager Unit Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { FilterManager } from "../src/js/modules/filters.js";

const sampleRecipes = [
  { id: "1", title: "Tomato Soup", difficulty: "easy", prepTime: 10 },
  { id: "2", title: "Beef Stew", difficulty: "hard", prepTime: 90 },
  { id: "3", title: "Chicken Curry", difficulty: "medium", prepTime: 45 },
  { id: "4", title: "Salad", difficulty: "easy", prepTime: 5 },
];

describe("FilterManager", () => {
  let filter;

  beforeEach(() => {
    filter = new FilterManager();
  });

  it("should filter by search term", () => {
    filter.setSearchTerm("tomato");
    const result = filter.filter(sampleRecipes);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Tomato Soup");
  });

  it("should filter by difficulty", () => {
    filter.setDifficulty("easy");
    const result = filter.filter(sampleRecipes);
    expect(result.every((r) => r.difficulty === "easy")).toBe(true);
  });

  it("should filter by max prep time", () => {
    filter.setMaxPrepTime(30);
    const result = filter.filter(sampleRecipes);
    expect(result.every((r) => r.prepTime <= 30)).toBe(true);
  });

  it("should apply all filters combined", () => {
    filter.setSearchTerm("s");
    filter.setDifficulty("easy");
    filter.setMaxPrepTime(10);
    const result = filter.filter(sampleRecipes);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Salad");
  });

  it("should return all when filters cleared", () => {
    filter.setSearchTerm("");
    filter.setDifficulty("all");
    filter.setMaxPrepTime(null);
    const result = filter.filter(sampleRecipes);
    expect(result).toHaveLength(sampleRecipes.length);
  });
});
