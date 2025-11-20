/**
 * ErrorHandler Singleton - Global error and promise rejection handling
 * @module errorHandler
 */

class ErrorHandler {
  constructor() {
    if (ErrorHandler.instance) {
      return ErrorHandler.instance;
    }
    ErrorHandler.instance = this;
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

  showUserError(message) {
    // Display user-friendly notification (implement your own UI)
    alert(message);
    // Alternatively: show a banner, modal etc.
  }
}

export const errorHandler = new ErrorHandler();
