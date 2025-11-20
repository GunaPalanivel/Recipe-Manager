/** Modal focus trap pseudocode */

class Modal {
  constructor(modalElement) {
    this.modalElement = modalElement;
    this.focusableElements = [
      ...modalElement.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      ),
    ];
    this.firstFocusable = this.focusableElements[0];
    this.lastFocusable =
      this.focusableElements[this.focusableElements.length - 1];
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  open() {
    this.modalElement.style.display = "block";
    this.firstFocusable.focus();
    document.addEventListener("keydown", this.handleKeyDown);
  }

  close() {
    this.modalElement.style.display = "none";
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(e) {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        // shift+tab
        if (document.activeElement === this.firstFocusable) {
          e.preventDefault();
          this.lastFocusable.focus();
        }
      } else {
        // tab
        if (document.activeElement === this.lastFocusable) {
          e.preventDefault();
          this.firstFocusable.focus();
        }
      }
    }
  }
}
