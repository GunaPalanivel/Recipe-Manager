# Recipe Manager

A modern, scalable single-page application (SPA) for recipe management with a responsive, accessible UI, real-time search and filtering, and robust CRUD operations. Built using Vanilla JavaScript, HTML, and CSS with a focus on maintainability and developer experience.

---

## Table of Contents

| Section                                                | Description                                     |
| ------------------------------------------------------ | ----------------------------------------------- |
| [Overview](#overview)                                  | Project summary and core capabilities           |
| [Features & Phases](#features--phases)                 | Breakdown of features by development phases     |
| [Project Structure](#project-structure)                | Key directories and files overview              |
| [How to Run the App](#how-to-run-the-app)              | Installation, startup, and testing instructions |
| [Data Structures](#data-structures-in-localstorage)    | Schema of data stored in localStorage           |
| [Assumptions & Limitations](#assumptions--limitations) | Constraints and known boundaries                |
| [Known Issues](#known-issues)                          | Current gaps or bugs                            |
| [Testing & Coverage](#testing--coverage)               | Quality assurance details                       |
| [Contributing](#contributing)                          | Collaboration guidelines                        |
| [License](#license)                                    | Legal usage terms                               |

---

## Overview

Recipe Manager is a resilient SPA that allows users to browse, filter, create, update, and delete recipes seamlessly. It features:

- Real-time search with debounced input
- Multi-category filters with colored badges
- Difficulty and time sliders for precise filtering
- Accessible, WCAG AA-compliant UI with ARIA roles and keyboard navigation
- Robust form validation and error handling
- Full test coverage with unit and integration tests
- Optimistic UI updates and graceful error recovery

Designed to be production-ready for both end users and developers, prioritizing maintainability and performance.

---

## Features & Phases

| Phase | Branch                                                                                 | Pull Request                                              | Key Deliverables                                           |
| ----- | -------------------------------------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------- |
| 0     | main                                                                                   | Initial                                                   | Project scaffolding and base setup                         |
| 1     | [feature/data-layer](https://github.com/GunaPalanivel/Recipe-Manager/pull/1)           | (https://github.com/GunaPalanivel/Recipe-Manager/pull/1)  | localStorage abstraction, Recipe model, validation, tests  |
| 2     | [feature/home-page](https://github.com/GunaPalanivel/Recipe-Manager/pull/2)            | (https://github.com/GunaPalanivel/Recipe-Manager/pull/2)  | Responsive recipe grid with lazy images                    |
| 3     | [feature/search-filter](https://github.com/GunaPalanivel/Recipe-Manager/pull/3)        | (https://github.com/GunaPalanivel/Recipe-Manager/pull/3)  | Search bar, difficulty filter, prep/cook time sliders      |
| 4     | [feature/detail-page](https://github.com/GunaPalanivel/Recipe-Manager/pull/4)          | (https://github.com/GunaPalanivel/Recipe-Manager/pull/4)  | Recipe detail view with edit/delete and print layout       |
| 5     | [feature/recipe-form](https://github.com/GunaPalanivel/Recipe-Manager/pull/5)          | (https://github.com/GunaPalanivel/Recipe-Manager/pull/5)  | Dynamic, validated form with image preview and draft save  |
| 6     | [feature/crud-operations](https://github.com/GunaPalanivel/Recipe-Manager/pull/6)      | (https://github.com/GunaPalanivel/Recipe-Manager/pull/6)  | Complete CRUD operations with optimistic UI updates        |
| 7     | [feature/error-handling](https://github.com/GunaPalanivel/Recipe-Manager/pull/7)       | (https://github.com/GunaPalanivel/Recipe-Manager/pull/7)  | Robust error boundaries, quota errors, recovery flows      |
| 8     | [feature/responsive-a11y](https://github.com/GunaPalanivel/Recipe-Manager/pull/8)      | (https://github.com/GunaPalanivel/Recipe-Manager/pull/8)  | WCAG AA compliance, mobile breakpoints, touch targets      |
| 9     | [fix/multi-file-bugfix](https://github.com/GunaPalanivel/Recipe-Manager/pull/9)        | (https://github.com/GunaPalanivel/Recipe-Manager/pull/9)  | Major multi-file bugfix and refactor                       |
| 10    | [feature/phase-1-2](https://github.com/GunaPalanivel/Recipe-Manager/pull/10)           | (https://github.com/GunaPalanivel/Recipe-Manager/pull/10) | Phase 1-2 implementation with advanced filter bar          |
| 11    | [feature/ux-advanced-filters](https://github.com/GunaPalanivel/Recipe-Manager/pull/11) | (https://github.com/GunaPalanivel/Recipe-Manager/pull/11) | Recipe category system and advanced filter bar (Phase 1-2) |

### Highlights

- Category & difficulty badges with clear visual cues
- Performance optimizations via DocumentFragment, debounce, and O(1) lookups
- Full accessibility: ARIA roles, keyboard nav, and skip links
- Complete error handling with user-friendly messaging

---

## Project Structure

```
recipe-manager/
├── pages/
│   ├── detail.html
│   ├── form.html
├── src/
│   ├── assets/images/
│   ├── css/
│   │   ├── components/
│   │   └── utils/
│   ├── data/
│   │   └── sample-recipes.js
│   ├── js/
│   │   ├── modules/
│   │   └── utils/
│   └── main.js
├── tests/
├── .gitignore
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── README.md
├── index.html
└── package.json
```

---

## How to Run the App

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- Modern web browser (Chrome, Edge, Firefox, or Safari)
- Git installed on your system

### Installation and Setup

Clone the repository:

```bash
git clone https://github.com/GunaPalanivel/Recipe-Manager.git
```

Navigate into the project directory:

```bash
cd Recipe-Manager
```

Install dependencies (optional for development environment):

```bash
npm install
```

### Building the Application

If there is a build step, run the following command:

```bash
npm run build
```

_(Note: Add or modify this step if your project requires a specific build process, e.g., bundling or transpiling.)_

### Running the Application

Start the local development server (recommended):

```bash
npx live-server
```

Alternatively, open `index.html` directly in your browser for static usage.

### Previewing the Application

After starting the development server, open your browser and navigate to:

```
http://localhost:8080
```

(or the URL provided by the live-server output)

You will then see the Recipe Manager app running live locally.

### Running Tests

Execute the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

---

## Data Structures in localStorage

### Storage Key

**`"recipes"`**

### Recipe Schema

Each recipe object in the array follows this structure:

```js
{
  id: "uuid-v4-string",              // Unique identifier for the recipe
  title: "Tomato Soup",      // Recipe name
  description: "A warm, comforting tomato soup perfect for any season.", // Brief description
  ingredients: [                     // List of ingredients
    "4 large tomatoes",
    "1 onion",
    "2 cloves garlic",
    "2 cups vegetable broth",
    "Salt",
    "Pepper"
  ],
  steps: [                          // Step-by-step preparation instructions
    "Chop tomatoes, onion, and garlic.",
    "Sauté onion and garlic in pot.",
    "Add tomatoes and broth.",
    "Simmer 20 minutes.",
    "Blend until smooth.",
    "Season to taste."
  ],
  prepTime: 10,                    // Preparation time in minutes
  cookTime: 30,                    // Cooking time in minutes
  difficulty: "easy",              // Difficulty level: "easy" | "medium" | "hard"
  category: "veg",                 // Recipe category: "veg" | "vegetarian" | "nonveg" | "fruit" | "dessert"
  imageURL: "/src/assets/images/easy/tomato-soup.jpg"  // Relative or absolute URL to image
}
```

Validation occurs upon creation and updates, with recovery logic for corrupted or invalid data.

| Field       | Type   | Required | Constraints                                       | Error Messages                                                                                 | Notes on Error Handling                      |
| ----------- | ------ | -------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------- |
| title       | String | Yes      | Length: 3 to 100 characters                       | "Title must be at least 3 characters" <br> "Title must not exceed 100 characters"              | Real-time validation; error shown near input |
| description | String | Yes      | Length: 10 to 500 characters                      | "Description must be at least 10 characters" <br> "Description must not exceed 500 characters" | Real-time validation; error shown near input |
| prepTime    | Number | Yes      | Integer between 1 and 999                         | "Time must be between 1 and 999 minutes"                                                       | Real-time validation; parses integer         |
| cookTime    | Number | Yes      | Integer between 1 and 999                         | "Time must be between 1 and 999 minutes"                                                       | Real-time validation; parses integer         |
| difficulty  | String | Yes      | One of: "easy", "medium", "hard"                  | "Please select a valid difficulty level"                                                       | Validates against allowed set                |
| imageURL    | String | No       | Valid URL (http://, https://) or local asset path | "Please enter a valid URL (http:// or https://)"                                               | Validates URLs and local asset paths         |
| ingredients | Array  | Yes      | Minimum 1, Maximum 50 items                       | "At least 1 ingredient required" <br> "Maximum 50 ingredients allowed"                         | Validates array length boundaries            |
| steps       | Array  | Yes      | Minimum 1, Maximum 20 items                       | "At least 1 step required" <br> "Maximum 20 steps allowed"                                     | Validates array length boundaries            |

| Error Handling Feature               | Description                                                            |
| ------------------------------------ | ---------------------------------------------------------------------- |
| Global Error Listener                | Catches unexpected errors via `window.error`                           |
| Unhandled Promise Rejection Listener | Catches unhandled promise rejections via `window.unhandledrejection`   |
| User-friendly Error Message          | Shows alert with friendly message; replaceable with UI banner or modal |
| Singleton Pattern                    | `ErrorHandler` ensures single global error handler instance            |

---

## Assumptions & Limitations

### Browser Support

- Tested on latest versions of Chrome, Edge, Firefox, and Safari
- Requires modern JavaScript features (ES6+)
- localStorage must be enabled

### Data Constraints

- Single-user SPA with localStorage; no multi-device synchronization
- Maximum recommended capacity: 999 recipes for optimal performance
- Virtual scrolling recommended beyond 100 recipes
- Storage limit: ~5-10MB (browser dependent)

### Input Constraints

- Time units are in minutes only
- Difficulty and category values are limited to predefined enums
- Image URLs must be valid and accessible; fallback placeholder provided for errors

### Privacy & Security

- No authentication system; recipes are private to current browser
- Data cleared when browser cache/storage is cleared
- XSS prevention through input sanitization

---

## Known Issues

### Mobile Experience

- Certain modals/dialogs may not fully trap virtual keyboard focus
- Touch target sizes meet minimum standards but could be optimized further

### Image Handling

- Image fetch may be slow if source server has high latency
- No image caching beyond browser defaults

### Accessibility

- Custom sliders could provide enhanced screen reader hints
- Some dynamic content announcements could be more descriptive

### Data Management

- No data import/export functionality (planned for future release)
- No backup/restore mechanism
- Clearing browser data results in complete data loss

### Browser-Specific

- Private browsing mode may disable localStorage in some browsers
- localStorage quota exceeded errors need manual data cleanup

---

## Testing & Coverage

### Test Suites

| Suite              | Tests Passed | Coverage | Description                                |
| ------------------ | ------------ | -------- | ------------------------------------------ |
| Unit & Integration | 23/23        | 95%+     | Core functionality across all modules      |
| Filter Logic       | ✅           | High     | Search, category, difficulty, time filters |
| Storage CRUD       | ✅           | High     | Create, read, update, delete operations    |
| Validation         | ✅           | High     | Input validation and schema checks         |
| Error Handling     | ✅           | High     | Corruption, quota, network errors          |

### Coverage Details

**Tested Components:**

- `StorageManager`: localStorage operations, cache management, corruption recovery
- `CRUDManager`: Full create, update, delete workflows with optimistic UI
- `FilterManager`: Multi-criteria filtering with chaining and edge cases
- `ValidationManager`: All validation rules and error messages
- `ErrorHandler`: Global error boundaries and recovery flows

**Edge Cases Covered:**

- Corrupted localStorage data
- localStorage quota exceeded
- Invalid user input across all form fields
- Null/undefined/malformed data handling
- Network failures for image loading
- Browser API unavailability

### Accessibility Testing

- Lighthouse accessibility audits (90+ score)
- axe DevTools compliance checks
- Keyboard navigation verification
- Screen reader testing (NVDA, JAWS)
- WCAG AA contrast ratio verification

### Running Tests

```bash
# Run all tests
npm test
```

```bash
# Run with coverage report
npm run test:coverage
```

```bash
# Run in watch mode
npm run test:watch
```

```bash
# Run specific test file
npm test -- FilterManager.test.js
```

## Contributing

We welcome contributions from the community! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Follow the existing code structure and naming conventions
4. Write tests for new functionality
5. Ensure all tests pass: `npm test`
6. Follow BEM CSS methodology for styling
7. Maintain accessibility standards (WCAG AA)
8. Submit PR with clear description and link to related issue

### Code Standards

- **JavaScript**: ES6+ with JSDoc comments
- **CSS**: BEM methodology, mobile-first approach
- **Commits**: Semantic commit messages (feat, fix, docs, style, refactor, test, chore)
- **Testing**: Unit tests required for new features
- **Accessibility**: ARIA labels and keyboard navigation mandatory

---

## License

MIT License © 2025 Recipe Manager Authors.  
Usage, distribution, and modification allowed. See LICENSE for details.

---

## Questions or Issues?

For questions, feature requests, or bug reports:

- Open an [issue](https://github.com/GunaPalanivel/Recipe-Manager/issues)
- Submit a [pull request](https://github.com/GunaPalanivel/Recipe-Manager/pulls)

---

**Built with 🪡 by Guna Palanivel**
