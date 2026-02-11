# AGENTS.md

This file provides guidelines for agentic coding agents working in the bebebendle repository.

## Build, Lint, and Test Commands

**Package Manager:** Bun (use `bun` not `npm`)

### Available Scripts
```bash
# Development
bun run dev          # Start Next.js dev server on http://localhost:3000

# Build
bun run build        # Build production Next.js app
bun run start        # Start production server (after build)

# Linting
bun run lint         # Run ESLint on the entire codebase
bun run lint --fix   # Auto-fix ESLint issues
```

### Testing
**No test framework is currently configured.** If adding tests, consider:
- Vitest for unit testing (recommended for Vite/Next.js projects)
- Playwright for E2E testing

## Code Style Guidelines

### TypeScript
- **Target:** ES2017
- **Strict mode:** Enabled - all strict TypeScript options must be followed
- **Module:** ESNext with bundler resolution
- **JSX:** react-jsx transform (no need to import React)

### Imports and Path Aliases
- Use `@/*` alias for absolute imports from project root
- Example: `import { db } from "@/db/schema"`
- Prefer named imports over default imports where possible

### File and Naming Conventions
- **React Components:** PascalCase (e.g., `UserProfile.tsx`)
- **Utility files:** camelCase (e.g., `formatDate.ts`)
- **Directories:** kebab-case (e.g., `user-profile/`)
- **Config files:** kebab-case with appropriate extension (e.g., `eslint.config.mjs`)

### React Conventions
- Use functional components with explicit return types
- Use `Readonly<>` for props to enforce immutability
- Prefer early returns over nested conditionals
- Use Server Components by default; add `"use client"` only when needed

### Styling (Tailwind CSS v4)
- Use Tailwind CSS v4 syntax in `globals.css`:
  ```css
  @import "tailwindcss";
  @theme inline { ... }
  ```
- Prefer Tailwind utility classes over inline styles
- Use CSS variables for theming (already configured for light/dark mode)

### Error Handling
- Use TypeScript's strict null checks
- Prefer explicit error handling with try/catch for async operations
- Avoid using `any` type - use `unknown` with type guards instead

### Database (Drizzle ORM)
- Define schemas in `db/schema.ts`
- Use Drizzle Kit for migrations: `bunx drizzle-kit generate`
- Prefer type-safe queries using Drizzle ORM over raw SQL

### ESLint
- Uses ESLint 9 flat config format
- Extends Next.js core-web-vitals and TypeScript rules
- Run `bun run lint` before committing

## Project Structure

```
app/           # Next.js App Router pages and layouts
db/            # Drizzle ORM schema and database files
public/        # Static assets
backend/       # Backend API code (currently empty)
```

## Important Notes

- This project uses **Next.js 16** with **React 19**
- **No Prettier** is configured - rely on ESLint for formatting
- SQLite database at `db/bebendle.sqlite`
- Dark mode is supported via `prefers-color-scheme`
- Geist font is used for both sans and mono typography
