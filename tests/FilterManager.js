export class FilterManager {
  constructor() {
    this.searchTerm = "";
    this.difficulty = "all";
    this.selectedCategories = [
      "veg",
      "nonveg",
      "fruit",
      "dessert",
      "vegetarian",
    ];
    this.prepTimeMin = 0;
    this.prepTimeMax = 120;
    this.cookTimeMin = 0;
    this.cookTimeMax = 180;
  }

  setSearchTerm(term) {
    this.searchTerm = term.toLowerCase().trim();
  }

  setDifficulty(level) {
    this.difficulty = level;
  }

  setCategories(categories) {
    this.selectedCategories = categories;
  }

  setPrepTime(min, max) {
    this.prepTimeMin = min;
    this.prepTimeMax = max;
  }

  setCookTime(min, max) {
    this.cookTimeMin = min;
    this.cookTimeMax = max;
  }

  filter(recipes) {
    return recipes.filter((r) => {
      // Search match (title or description)
      const searchMatch =
        !this.searchTerm ||
        (r.title && r.title.toLowerCase().includes(this.searchTerm)) ||
        (r.description &&
          r.description.toLowerCase().includes(this.searchTerm));

      // Difficulty match
      const difficultyMatch =
        this.difficulty === "all" || r.difficulty === this.difficulty;

      // Category multi-select match
      const categoryMatch =
        this.selectedCategories.length === 0
          ? false
          : this.selectedCategories.includes(r.category);

      // Prep time in range
      const prepTimeMatch =
        typeof r.prepTime === "number" &&
        r.prepTime >= this.prepTimeMin &&
        r.prepTime <= this.prepTimeMax;

      // Cook time in range
      const cookTimeMatch =
        typeof r.cookTime === "number" &&
        r.cookTime >= this.cookTimeMin &&
        r.cookTime <= this.cookTimeMax;

      return (
        searchMatch &&
        difficultyMatch &&
        categoryMatch &&
        prepTimeMatch &&
        cookTimeMatch
      );
    });
  }
}
