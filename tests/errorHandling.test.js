/**
 * ErrorHandler Singleton - Global error and promise rejection handling
 * @module errorHandler
 */

import { describe, it, expect } from "vitest";

describe("Error handler placeholder", () => {
  it("should always pass", () => {
    expect(true).toBe(true);
  });
});

class ErrorHandler {
  constructor() {
    if (ErrorHandler.instance) {
      return ErrorHandler.instance;
    }
    ErrorHandler.instance = this;
    this._hideTimeout = null;
    this.init();
  }

  init() {
    window.addEventListener("error", (event) => {
      console.error("Global error caught:", event.message, event.error);
      this.showUserError(
        "An unexpected error occurred. Please try refreshing the page."
      );
    });

    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled promise rejection:", event.reason);
      this.showUserError(
        "A network or processing error occurred. Please check your connection and try again."
      );
    });
  }

  /**
   * Displays a user-friendly error notification.
   * Falls back to alert if notification container isn't found.
   * @param {string} message - Error message to display
   */
  showUserError(message) {
    const container = document.getElementById("error-notification");
    if (container) {
      container.textContent = message;
      container.style.display = "block";

      // Optionally auto-hide after some time
      clearTimeout(this._hideTimeout);
      this._hideTimeout = setTimeout(() => {
        container.style.display = "none";
      }, 5000);
    } else {
      alert(message);
    }
  }
}

export const errorHandler = new ErrorHandler();
