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

// Image preview
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

// Save draft to localStorage
function saveDraft() {
  const draft = collectFormData();
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

// Load draft from localStorage
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

      // Populate ingredients
      ingredientsList.innerHTML = "";
      if (data.ingredients && data.ingredients.length > 0) {
        data.ingredients.forEach((ing) =>
          ingredientsList.appendChild(createIngredientField(ing))
        );
      } else {
        ingredientsList.appendChild(createIngredientField());
      }

      // Populate steps
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

// Auto-save on input
const debouncedSaveDraft = debounce(saveDraft, 1000);
form.addEventListener("input", debouncedSaveDraft);

// Form submission
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = collectFormData();

  if (!validator.validateAll(formData)) {
    validator.errors.forEach((error, field) => {
      validator.displayFieldError(field, error);
    });
    alert("Please fix the errors before submitting");
    return;
  }

  try {
    const recipe = createRecipe(formData);
    if (recipe) {
      storage.save(recipe);
      localStorage.removeItem(DRAFT_KEY);
      alert("Recipe saved successfully!");
      window.location.href = "/";
    }
  } catch (error) {
    alert("Failed to save recipe: " + error.message);
  }
});

cancelBtn.addEventListener("click", () => {
  if (confirm("Discard changes?")) {
    localStorage.removeItem(DRAFT_KEY);
    window.location.href = "/";
  }
});

// Initialize
loadDraft();
