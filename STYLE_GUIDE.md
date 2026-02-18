# Style Guide

This document defines the coding conventions and patterns used in this project. All future code should follow these rules to maintain consistency.

## Tech Stack

- **React 18** with Create React App (react-scripts 5.0.1)
- **MUI v5** (`@mui/material`, `@mui/icons-material`) for UI components
- **React Router v6** (`react-router-dom ^6.3.0`) for routing
- **React Context API** for state management (no Redux)
- **localStorage** for all data persistence (no backend)
- **Plain JavaScript** — no TypeScript
- **Jest + React Testing Library** for tests

## Project Structure

```
src/
├── assets/          # Static images and icons
│   ├── images/      # Logos, banners, hero images
│   └── icons/       # UI icons (body-part, target, equipment)
├── components/      # Reusable UI components
├── contexts/        # React Context providers and hooks
├── pages/           # Route-level page components
├── utils/           # Utility functions and helpers
├── App.js           # Root component with routes and providers
├── App.css          # Global styles and CSS variables
├── index.js         # Entry point (ThemeContextProvider, BrowserRouter)
└── setupTests.js    # Jest/Testing Library setup
```

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase `.js` | `ExerciseCard.js`, `FallbackImage.js` |
| Contexts | PascalCase with `Context` suffix | `FavoritesContext.js` |
| Pages | PascalCase `.js` | `ExerciseDetail.js`, `WorkoutBuilder.js` |
| Utilities | camelCase `.js` | `fetchData.js`, `scrollUtils.js` |
| Tests | Same name + `.test.js` suffix | `FavoritesContext.test.js` |
| CSS | PascalCase matching component | `App.css` |

## Component Patterns

### Functional Arrow Components Only

All components use arrow function syntax. No class components.

```jsx
// ✅ Correct
const MyComponent = () => {
  return (
    <Box>Content</Box>
  )
}

export default MyComponent
```

### One Component Per File

Each file exports a single component. The file name matches the component name.

### Export Conventions

- **Components and pages**: Use `export default`
- **Context providers and hooks**: Use named exports

### Props Destructuring

Destructure props in the function signature:

```jsx
const Detail = ({ exerciseDetail }) => { ... }
const SearchExercises = ({ setExercises, bodyPart, setBodyPart }) => { ... }
```

## Context Pattern

Every context follows this exact structure:

1. `createContext()` with `undefined` default
2. `Provider` component with `useState`, `useCallback`, `useMemo`
3. Custom `useXxx` hook that throws if used outside provider

```jsx
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const MyContext = createContext(undefined);
const STORAGE_KEY = 'myDataKey';

const MyProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addItem = useCallback((item) => {
    setData((prev) => {
      const updated = [...prev, item];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch (e)
      return updated;
    });
  }, []);

  const value = useMemo(() => ({ data, addItem }), [data, addItem]);

  return (
    <MyContext.Provider value={value}>{children}</MyContext.Provider>
  );
};

const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) throw new Error('useMyContext must be used within a MyProvider');
  return context;
};

export { MyProvider, useMyContext };
```

### Key Rules

- **Always** wrap localStorage reads/writes in `try/catch`
- **Always** use a `STORAGE_KEY` constant (not inline strings)
- **Always** use `useCallback` for functions passed to consumers
- **Always** use `useMemo` for the context value object
- **Always** use lazy initializer in `useState(() => ...)` for localStorage reads

## Styling

### MUI `sx` Prop (Primary)

Use MUI's `sx` prop for component-level styling. Use breakpoint objects for responsiveness:

```jsx
<Box sx={{
  mt: { lg: '212px', xs: '70px' },
  ml: { sm: '50px' },
  p: '20px'
}}>
```

MUI breakpoints used: `xs`, `sm`, `lg`, `xl`

### CSS Variables (Theming)

Global theme colors are defined as CSS variables in `App.css`:

```css
:root {
  --bg-primary: #FFFAFB;
  --text-primary: #3A1212;
  --accent: #FF2625;
}

[data-theme='dark'] {
  --bg-primary: #1A1A1A;
  --text-primary: #F5F5F5;
  --accent: #FF2625;
}
```

### Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Accent/Red | `#FF2625` | Primary action, borders, active links |
| Light Background | `#FFFAFB` | Page background (light mode) |
| Dark Background | `#1A1A1A` | Page background (dark mode) |
| Light Text | `#3A1212` | Primary text (light mode) |
| Dark Text | `#F5F5F5` | Primary text (dark mode) |

### Fonts

- **Primary**: `'Josefin Sans'` — body text, headings
- **Accent**: `'Alegreya'` — navigation links


## Import Ordering

Follow this order, separated by blank lines:

1. React and React hooks
2. Third-party libraries (react-router-dom, MUI)
3. Local components
4. Local contexts/hooks
5. Local utilities
6. Assets (images, icons)
7. CSS files

## localStorage Patterns

### Always Use Try/Catch

All localStorage reads/writes must be wrapped in try/catch with sensible defaults.

### Storage Key Naming

Use descriptive camelCase constants:
- `'favoriteExercises'`
- `'exerciseHistory'`
- `'exerciseTrackingLogs'`
- `'workoutExercises'`
- `'themeMode'`

## Error Handling

- Use `try/catch` for all async operations and localStorage access
- Display user-friendly error messages via state
- Log errors to console with `console.error`
- Provide fallback behavior (e.g., empty arrays, default values)

## Accessibility

- Add `role` and `aria-label` to navigation elements
- Include `alt` text on all images
- Use `aria-hidden="true"` for decorative elements
- Provide keyboard focus styles
- Use semantic HTML elements where possible

## Testing

### Test File Location

Tests are co-located with source files:

```
src/contexts/FavoritesContext.js
src/contexts/FavoritesContext.test.js
```

### Test Patterns

- **Context tests** — use `renderHook` + `act`
- **Component tests** — use `render` + `screen` + `fireEvent`
- **Page tests** — mock context hooks with `jest.mock`

### Test Naming

Use descriptive test names that explain the behavior being tested:

```jsx
test('adds exercise to favorites when toggle is called', () => { ... });
test('renders empty state when no favorites exist', () => { ... });
```

## Formatting Notes

- ESLint config extends `react-app` and `react-app/jest` (in `package.json`)
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for JSX string props and imports
- **Trailing commas**: Used in multi-line arrays and objects
- **Parentheses**: Wrap JSX returns in parentheses

## Routing

All routes are defined in `App.js`. Add new routes there. Wrap providers above `Routes`, not inside pages.

## Provider Nesting Order

Providers wrap `Routes` in `App.js` (inner) and `index.js` (outer):

```
ThemeContextProvider (index.js)
  └── BrowserRouter (index.js)
        └── HistoryProvider (App.js)
              └── FavoritesProvider
                    └── TrackingProvider
                          └── WorkoutProvider
                                └── Routes
```

Add new providers in `App.js` by wrapping the existing provider tree.