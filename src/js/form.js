import { StorageManager } from "./modules/storage.js";
import { Recipe, createRecipe } from "./modules/recipe.js";
import { ValidationManager } from "./modules/validation.js";
import { debounce } from "./utils/helpers.js";

const storage = new StorageManager();
const validator = new ValidationManager("recipe-form");

const ingredientsList = document.getElementById("ingredients-list");
const stepsList = document.getElementById("steps-list");
const addIngredientBtn = document.getElementById("add-ingredient");
const addStepBtn = document.getElementById("add-step");
const imageURLInput = document.getElementById("imageURL");
const imagePreview = document.getElementById("image-preview");
const form = document.getElementById("recipe-form");
const cancelBtn = document.getElementById("cancel-btn");

// Dynamic field management
function createIngredientField(value = "") {
  const div = document.createElement("div");
  div.className = "form__dynamic-item";
  div.innerHTML = `
    <input type="text" class="form__input" placeholder="e.g., 2 cups flour" value="${value}" required />
    <button type="button" class="btn-remove" aria-label="Remove ingredient">−</button>
  `;
  div.querySelector(".btn-remove").addEventListener("click", () => {
    if (ingredientsList.children.length > 1) {
      div.remove();
      saveDraft();
    }
  });
  return div;
}

function createStepField(value = "") {
  const div = document.createElement("div");
  div.className = "form__dynamic-item";
  div.innerHTML = `
    <textarea class="form__textarea" rows="2" placeholder="Describe this step" required>${value}</textarea>
    <button type="button" class="btn-remove" aria-label="Remove step">−</button>
  `;
  div.querySelector(".btn-remove").addEventListener("click", () => {
    if (stepsList.children.length > 1) {
      div.remove();
      saveDraft();
    }
  });
  return div;
}

addIngredientBtn.addEventListener("click", () => {
  ingredientsList.appendChild(createIngredientField());
  saveDraft();
});

addStepBtn.addEventListener("click", () => {
  stepsList.appendChild(createStepField());
  saveDraft();
});

// Collect form data
function collectFormData() {
  const ingredients = Array.from(ingredientsList.querySelectorAll("input"))
    .map((inp) => inp.value.trim())
    .filter((val) => val.length > 0);

  const steps = Array.from(stepsList.querySelectorAll("textarea"))
    .map((ta) => ta.value.trim())
    .filter((val) => val.length > 0);

  return {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    ingredients,
    steps,
    prepTime: parseInt(document.getElementById("prepTime").value, 10),
    cookTime: parseInt(document.getElementById("cookTime").value, 10),
    difficulty: document.getElementById("difficulty").value,
    imageURL: document.getElementById("imageURL").value.trim(),
  };
}

// To be continued in next commits...
