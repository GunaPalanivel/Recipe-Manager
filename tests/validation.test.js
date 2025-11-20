/**
 * Validation Tests
 *
 * @jest-environment jsdom
 */

/**
 * ValidationManager Unit Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import { ValidationManager } from "../src/js/modules/validation.js";

describe("ValidationManager", () => {
  let validator;
  let dom;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <form id="recipe-form">
        <input id="title" name="title" />
        <span id="title-error"></span>
        <textarea id="description" name="description"></textarea>
        <span id="description-error"></span>
        <input id="prepTime" name="prepTime" type="number" />
        <span id="prepTime-error"></span>
      </form>
    `);
    global.document = dom.window.document;
    validator = new ValidationManager("recipe-form");
  });

  it("should validate title length", () => {
    expect(validator.validateField("title", "ab")).toBe(false);
    expect(validator.validateField("title", "Valid Title")).toBe(true);
  });

  it("should validate description length", () => {
    expect(validator.validateField("description", "short")).toBe(false);
    expect(
      validator.validateField(
        "description",
        "This is a valid description with enough characters"
      )
    ).toBe(true);
  });

  it("should validate prep time range", () => {
    expect(validator.validateField("prepTime", "0")).toBe(false);
    expect(validator.validateField("prepTime", "1000")).toBe(false);
    expect(validator.validateField("prepTime", "30")).toBe(true);
  });

  it("should validate URL format", () => {
    expect(validator.isValidURL("invalid-url")).toBe(false);
    expect(validator.isValidURL("https://example.com/image.jpg")).toBe(true);
  });

  it("should validate ingredients count", () => {
    expect(validator.validateIngredients([])).toBe(false);
    expect(validator.validateIngredients(["flour", "sugar"])).toBe(true);
  });
});
