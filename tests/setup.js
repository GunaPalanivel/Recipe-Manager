/**
 * Vitest Test Setup
 * 
 * Global test configuration and mocks
 */

import { beforeEach, afterEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

// Mock performance API
const performanceMock = {
  mark: vi.fn(),
  measure: vi.fn(),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn(),
  getEntriesByName: vi.fn(() => []),
  getEntriesByType: vi.fn(() => []),
  now: vi.fn(() => Date.now()),
};

// Setup before each test
beforeEach(() => {
  // Clear localStorage
  localStorageMock.clear();
  
  // Attach mocks to global
  global.localStorage = localStorageMock;
  global.performance = performanceMock;
  
  // Reset all mocks
  vi.clearAllMocks();
});

// Cleanup after each test
afterEach(() => {
  vi.restoreAllMocks();
});
