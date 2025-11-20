/**
 * Recipe Model - Data structure and validation
 *
 * @module recipe
 * @description Recipe class, factory pattern, and data schema
 */

"use strict";

/**
 * Recipe Model - Class, Factory, and Validation
 * @module recipe
 */

/**
 * Sample recipes (5 per difficulty)
 * All fields present and valid
 */
import { DIFFICULTY_LEVELS, VALIDATION_RULES } from '../utils/constants.js';

export const sampleRecipes = [
  // Easy Recipes
  {
    id: 'easy-1',
    title: 'Classic Tomato Soup',
    description: 'A warm, comforting tomato soup perfect for any season.',
    ingredients: ['4 large tomatoes', '1 onion', '2 cloves garlic', '2 cups vegetable broth', 'Salt', 'Pepper'],
    steps: ['Chop tomatoes, onion, and garlic.', 'Sauté onion and garlic in pot.', 'Add tomatoes and broth.', 'Simmer 20 minutes.', 'Blend until smooth.', 'Season to taste.'],
    prepTime: 10,
    cookTime: 30,
    difficulty: DIFFICULTY_LEVELS.EASY,
    imageURL: '/src/assets/images/easy/tomato-soup.jpg',
  },
  {
    id: 'easy-2',
    title: 'Scrambled Eggs',
    description: 'Fluffy scrambled eggs with a creamy texture.',
    ingredients: ['4 eggs', '2 tbsp milk', 'Salt', 'Pepper', 'Butter'],
    steps: ['Crack eggs into bowl.', 'Add milk, salt, and pepper.', 'Whisk until combined.', 'Melt butter in pan.', 'Cook eggs over low heat, stirring gently until set.'],
    prepTime: 5,
    cookTime: 5,
    difficulty: DIFFICULTY_LEVELS.EASY,
    imageURL: '/src/assets/images/easy/scrambled-eggs.jpg',
  },
  // Add 3 more easy recipes...

  // Medium Recipes
  {
    id: 'medium-1',
    title: 'Chicken Alfredo Pasta',
    description: 'Creamy Alfredo sauce with grilled chicken and fettuccine pasta.',
    ingredients: ['200g fettuccine', '150g chicken breast', '1 cup heavy cream', '1/2 cup Parmesan', '2 cloves garlic', 'Salt', 'Pepper'],
    steps: ['Cook pasta following package instructions.', 'Grill chicken and slice.', 'Prepare Alfredo sauce with cream, cheese, and garlic.', 'Combine pasta, chicken, and sauce.', 'Serve warm.'],
    prepTime: 20,
    cookTime: 25,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    imageURL: '/src/assets/images/medium/chicken-alfredo.jpg',
  },
  // Add 4 more medium recipes...

  // Hard Recipes
  {
    id: 'hard-1',
    title: 'Beef Wellington',
    description: 'Classic Beef Wellington with mushroom duxelles and puff pastry.',
    ingredients: ['1 beef tenderloin', '250g mushrooms', '1 sheet puff pastry', '2 tbsp Dijon mustard', '1 egg', 'Salt', 'Pepper'],
    steps: ['Sear beef tenderloin.', 'Prepare mushroom duxelles.', 'Wrap beef and duxelles in puff pastry.', 'Brush with egg wash.', 'Bake at 200°C for 40 minutes.', 'Rest 10 minutes before serving.'],
    prepTime: 60,
    cookTime: 45,
    difficulty: DIFFICULTY_LEVELS.HARD,
    imageURL: '/src/assets/images/hard/beef-wellington.jpg',
  },
  // Add 4 more hard recipes...
];


/**
 * Generate UUID v4 string
 * @returns {string}
 */
function generateUUID() {
  if (crypto?.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Recipe class representing a recipe entry
 */
export class Recipe {
  /**
   * Create a new Recipe instance
   * @param {Object} data
   * @param {string} data.id Unique recipe ID
   * @param {string} data.title Recipe title
   * @param {string} data.description Recipe description
   * @param {Array<string>} data.ingredients List of ingredients
   * @param {Array<string>} data.steps Cooking steps
   * @param {number} data.prepTime Preparation time in minutes
   * @param {number} data.cookTime Cooking time in minutes
   * @param {string} data.difficulty Difficulty level
   * @param {string} [data.imageURL] Optional image URL
   */
  constructor({
    id = generateUUID(),
    title,
    description,
    ingredients,
    steps,
    prepTime,
    cookTime,
    difficulty,
    imageURL = '',
  } = {}) {
    this.id = id;
    this.title = title.trim();
    this.description = description.trim();
    this.ingredients = ingredients.map(i => i.trim());
    this.steps = steps.map(s => s.trim());
    this.prepTime = prepTime;
    this.cookTime = cookTime;
    this.difficulty = difficulty;
    this.imageURL = imageURL.trim();
    this.validate();
  }

  /**
   * Validate recipe data fields
   * Throws error if invalid
   */
  validate() {
    const rules = VALIDATION_RULES;

    if (typeof this.title !== 'string' || this.title.length < rules.title.minLength || this.title.length > rules.title.maxLength) {
      throw new Error(`Title must be between ${rules.title.minLength}-${rules.title.maxLength} characters`);
    }

    if (typeof this.description !== 'string' || this.description.length < rules.description.minLength || this.description.length > rules.description.maxLength) {
      throw new Error(`Description must be between ${rules.description.minLength}-${rules.description.maxLength} characters`);
    }

    if (!Array.isArray(this.ingredients) || this.ingredients.length < rules.ingredientsMin || this.ingredients.length > rules.ingredientsMax) {
      throw new Error(`Ingredients must contain between ${rules.ingredientsMin} and ${rules.ingredientsMax} items`);
    }

    if (!Array.isArray(this.steps) || this.steps.length < rules.stepsMin || this.steps.length > rules.stepsMax) {
      throw new Error(`Steps must contain between ${rules.stepsMin} and ${rules.stepsMax} items`);
    }

    if (typeof this.prepTime !== 'number' || this.prepTime < rules.prepTimeMin || this.prepTime > rules.prepTimeMax) {
      throw new Error(`Preparation time must be between ${rules.prepTimeMin} and ${rules.prepTimeMax} minutes`);
    }

    if (typeof this.cookTime !== 'number' || this.cookTime < rules.cookTimeMin || this.cookTime > rules.cookTimeMax) {
      throw new Error(`Cooking time must be between ${rules.cookTimeMin} and ${rules.cookTimeMax} minutes`);
    }

    if (!rules.difficultyValues.includes(this.difficulty)) {
      throw new Error(`Difficulty must be one of: ${rules.difficultyValues.join(', ')}`);
    }

    if (this.imageURL && !this._isValidURL(this.imageURL)) {
      throw new Error('Image URL is not valid');
    }
  }

  /**
   * Validate URL format (simple regex)
   * @param {string} url
   * @returns {boolean}
   */
  _isValidURL(url) {
    try {
      const u = new URL(url);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }
}

/**
 * Factory function to create Recipe instances safely from raw data
 * @param {Object} data
 * @returns {Recipe}
 */
export function createRecipe(data) {
  try {
    return new Recipe(data);
  } catch (error) {
    console.warn('Invalid recipe data:', error.message);
    return null;
  }
}
