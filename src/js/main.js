/**
 * Recipe Manager - Main Entry Point
 *
 * @module main
 * @description Application entry point for the home page
 *
 * Performance target: First Contentful Paint < 1.5s
 *
 * @author Your Name
 * @version 1.0.0
 */

"use strict";

// Imports will be added in subsequent phases
// import { StorageManager } from './modules/storage.js';
// import { UIManager } from './modules/ui.js';
// import { FilterManager } from './modules/filters.js';
// import { PerformanceMonitor } from './modules/performance.js';
import { StorageManager } from './modules/storage.js';
import { sampleRecipes } from './data/sample-recipes.js';

const storage = new StorageManager();
storage.seed(sampleRecipes);

console.log("🍳 Recipe Manager initialized - Phase 0");

// Application initialization will be added in Phase 2
