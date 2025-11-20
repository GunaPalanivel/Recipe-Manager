import { StorageManager } from "./storage.js";
import { createRecipe } from "./recipe.js";

const storage = new StorageManager();
const detailContainer = document.querySelector(".recipe-detail");

function getRecipeIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

function renderNotFound() {
  detailContainer.innerHTML =
    '<p>Recipe not found. <a href="/">Return to home.</a></p>';
}

function renderRecipe(recipe) {
  detailContainer.innerHTML = `
    <h1 class="recipe-detail__title">${recipe.title}</h1>
    <img src="${recipe.imageURL || "/src/assets/images/placeholder.jpg"}" alt="${recipe.title}" class="recipe-detail__image" />
    
    <section class="recipe-detail__section">
      <h2>Description</h2>
      <p>${recipe.description}</p>
    </section>
    
    <section class="recipe-detail__section">
      <h2>Ingredients</h2>
      <ul class="recipe-detail__list">
        ${recipe.ingredients.map((ing) => `<li>${ing}</li>`).join("")}
      </ul>
    </section>
    
    <section class="recipe-detail__section">
      <h2>Steps</h2>
      <ol class="recipe-detail__list">
        ${recipe.steps.map((step) => `<li>${step}</li>`).join("")}
      </ol>
    </section>
    
    <section class="recipe-detail__section">
      <strong>Preparation Time:</strong> ${recipe.prepTime} minutes<br />
      <strong>Cooking Time:</strong> ${recipe.cookTime} minutes<br />
      <strong>Difficulty:</strong> ${recipe.difficulty}
    </section>

    <div class="recipe-detail__buttons">
      <button id="edit-btn" class="btn btn--primary" aria-label="Edit recipe ${recipe.title}">Edit</button>
      <button id="delete-btn" class="btn btn--danger" aria-label="Delete recipe ${recipe.title}">Delete</button>
    </div>
  `;

  document.getElementById("edit-btn").addEventListener("click", () => {
    window.location.href = `/pages/form.html?id=${encodeURIComponent(recipe.id)}`;
  });

  document.getElementById("delete-btn").addEventListener("click", handleDelete);
}

function handleDelete() {
  if (
    confirm(
      "Are you sure you want to delete this recipe? This action cannot be undone."
    )
  ) {
    const id = getRecipeIdFromURL();
    try {
      storage.remove(id);
      alert("Recipe deleted successfully.");
      window.location.href = "/";
    } catch (error) {
      alert("Failed to delete recipe. Please try again.");
      console.error(error);
    }
  }
}

function init() {
  const id = getRecipeIdFromURL();
  if (!id) {
    renderNotFound();
    return;
  }
  const recipes = storage.getAll();
  const recipe = recipes.find((r) => r.id === id);
  if (!recipe) {
    renderNotFound();
  } else {
    renderRecipe(recipe);
  }
}

document.addEventListener("DOMContentLoaded", init);
