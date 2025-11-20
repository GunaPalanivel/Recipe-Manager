import { StorageManager } from "./modules/storage.js";
import { createRecipe } from "./modules/recipe.js";
import { ValidationManager } from "./modules/validation.js";
import { debounce } from "./utils/helpers.js";
import { CRUDManager } from "./crud.js";

const storage = new StorageManager();
const validator = new ValidationManager("recipe-form");
const crud = new CRUDManager();

const ingredientsList = document.getElementById("ingredients-list");
const stepsList = document.getElementById("steps-list");
const addIngredientBtn = document.getElementById("add-ingredient");
const addStepBtn = document.getElementById("add-step");
const imageURLInput = document.getElementById("imageURL");
const imagePreview = document.getElementById("image-preview");
const form = document.getElementById("recipe-form");
const cancelBtn = document.getElementById("cancel-btn");

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

const debouncedImagePreview = debounce(() => {
  const url = imageURLInput.value.trim();
  imagePreview.innerHTML = "";

  if (!url) return;

  if (!validator.isValidURL(url)) {
    validator.displayFieldError("imageURL", "Invalid URL format");
    return;
  }

  validator.clearFieldError("imageURL");

  const img = document.createElement("img");
  img.src = url;
  img.alt = "Recipe image preview";
  img.onerror = () => {
    imagePreview.innerHTML =
      '<p style="color: var(--color-error);">Failed to load image</p>';
  };
  imagePreview.appendChild(img);
}, 500);

imageURLInput.addEventListener("input", debouncedImagePreview);

const DRAFT_KEY = "recipe_form_draft";

function saveDraft() {
  const draft = collectFormData();
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

function loadDraft() {
  const draft = localStorage.getItem(DRAFT_KEY);
  if (draft) {
    try {
      const data = JSON.parse(draft);
      document.getElementById("title").value = data.title || "";
      document.getElementById("description").value = data.description || "";
      document.getElementById("prepTime").value = data.prepTime || "";
      document.getElementById("cookTime").value = data.cookTime || "";
      document.getElementById("difficulty").value = data.difficulty || "";
      document.getElementById("imageURL").value = data.imageURL || "";

      ingredientsList.innerHTML = "";
      if (data.ingredients && data.ingredients.length > 0) {
        data.ingredients.forEach((ing) =>
          ingredientsList.appendChild(createIngredientField(ing))
        );
      } else {
        ingredientsList.appendChild(createIngredientField());
      }

      stepsList.innerHTML = "";
      if (data.steps && data.steps.length > 0) {
        data.steps.forEach((step) =>
          stepsList.appendChild(createStepField(step))
        );
      } else {
        stepsList.appendChild(createStepField());
      }
    } catch (error) {
      console.error("Failed to load draft:", error);
    }
  }
}

const debouncedSaveDraft = debounce(saveDraft, 1000);
form.addEventListener("input", debouncedSaveDraft);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = collectFormData();

  if (!validator.validateAll(formData)) {
    validator.errors.forEach((error, field) => {
      validator.displayFieldError(field, error);
    });
    alert("Please fix the errors before submitting.");
    return;
  }

  try {
    // If editing, update; else create
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (id) {
      await crud.updateRecipe(id, formData);
      alert("Recipe updated successfully!");
    } else {
      await crud.createRecipe(formData);
      alert("Recipe created successfully!");
    }
    localStorage.removeItem(DRAFT_KEY);
    window.location.href = "/";
  } catch (error) {
    alert("Error saving recipe: " + error.message);
  }
});

cancelBtn.addEventListener("click", () => {
  if (confirm("Discard changes?")) {
    localStorage.removeItem(DRAFT_KEY);
    window.location.href = "/";
  }
});

function prepopulateForm(id) {
  const existingRecipe = crud.getRecipeById(id);
  if (!existingRecipe) {
    alert("Recipe not found");
    window.location.href = "/";
    return;
  }

  document.getElementById("form-title").textContent = "Edit Recipe";

  document.getElementById("title").value = existingRecipe.title;
  document.getElementById("description").value = existingRecipe.description;
  document.getElementById("prepTime").value = existingRecipe.prepTime;
  document.getElementById("cookTime").value = existingRecipe.cookTime;
  document.getElementById("difficulty").value = existingRecipe.difficulty;
  document.getElementById("imageURL").value = existingRecipe.imageURL || "";

  ingredientsList.innerHTML = "";
  existingRecipe.ingredients.forEach((ing) =>
    ingredientsList.appendChild(createIngredientField(ing))
  );

  stepsList.innerHTML = "";
  existingRecipe.steps.forEach((step) =>
    stepsList.appendChild(createStepField(step))
  );

  // Trigger image preview
  debouncedImagePreview();
}

function initForm() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  if (id) {
    prepopulateForm(id);
  } else {
    loadDraft();
  }
}

initForm();
