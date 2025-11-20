/**
 * StorageManager Unit Tests
 * @jest-environment jsdom
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { StorageManager } from '../src/js/modules/storage.js';

describe('StorageManager', () => {
  let storage;

  beforeEach(() => {
    storage = new StorageManager();
    localStorage.clear();
  });

  it('should return empty array if no recipes stored', () => {
    expect(storage.getAll()).toEqual([]);
  });

  it('should save and retrieve recipes correctly', () => {
    const recipes = [
      { id: 'r1', title: 'Recipe 1' },
      { id: 'r2', title: 'Recipe 2' },
    ];
    recipes.forEach(r => storage.save(r));
    const all = storage.getAll();
    expect(all.length).toBe(2);
    expect(all.find(r => r.id === 'r1').title).toBe('Recipe 1');
  });

  it('should remove a recipe by id', () => {
    const recipe = { id: 'r3', title: 'Delete me' };
    storage.save(recipe);
    expect(storage.getAll().length).toBe(1);
    storage.remove(recipe.id);
    expect(storage.getAll()).toEqual([]);
  });

  it('should clear all recipes', () => {
    storage.save({ id: 'r1', title: 'One' });
    storage.save({ id: 'r2', title: 'Two' });
    storage.clear();
    expect(storage.getAll()).toEqual([]);
  });

  it('should handle corrupted data gracefully', () => {
    localStorage.setItem('recipes', '{invalid json}');
    const newStorage = new StorageManager();
    expect(newStorage.getAll()).toEqual([]);
  });
});
