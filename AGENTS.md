# AGENTS.md

This file provides guidelines for agentic coding agents working in the bebebendle repository.

## Project Overview

This is a **monorepo** with a Next.js frontend and Python Telegram bot, using PostgreSQL via Docker.

**Services:**
- `frontend/` - Next.js 16 + React 19 + TypeScript
- `bot/` - Python 3.11 + aiogram (Telegram bot)
- `db/` - PostgreSQL 15 (Docker)

## Build, Lint, and Test Commands

### Frontend (Next.js)
**Package Manager:** Bun (use `bun` not `npm`)

```bash
# Development
bun run dev          # Start dev server on http://localhost:3000

# Build & Deploy
bun run build        # Build production app
bun run start        # Start production server
make up-build        # Build and start all Docker services

# Linting
bun run lint         # Run ESLint
bun run lint --fix   # Auto-fix ESLint issues
```

### Python Bot
**Package Manager:** UV

```bash
# Development (in bot/ directory)
uv sync              # Install dependencies
uv run python src/main.py  # Run bot locally

# Linting & Type Checking
ruff check .         # Run Ruff linter
ruff check --fix .   # Auto-fix issues
mypy src/            # Run MyPy type checker

# Testing
pytest               # Run all tests
pytest -xvs          # Run with verbose output
pytest -xvs path/to/test_file.py::test_function  # Run single test
```

### Database
```bash
make migrate         # Run Drizzle migrations
make generate-migration  # Generate new migration
```

### Docker Operations
```bash
make up              # Start all services
make down            # Stop all services
make logs-frontend   # View frontend logs
make logs-bot        # View bot logs
make shell-frontend  # Open shell in frontend container
```

## Code Style Guidelines

### TypeScript (Frontend)

**Configuration:**
- Target: ES2017, Strict mode enabled
- Module: ESNext with bundler resolution
- JSX: react-jsx transform (no React import needed)

**Imports:**
- Use `@/*` alias for absolute imports: `import { db } from "@/db/schema"`
- Prefer named imports over default imports

**Naming Conventions:**
- React Components: PascalCase (e.g., `UserProfile.tsx`)
- Utility files: camelCase (e.g., `formatDate.ts`)
- Directories: kebab-case (e.g., `user-profile/`)
- Config files: kebab-case (e.g., `eslint.config.mjs`)

**React Patterns:**
- Use functional components with explicit return types
- Use `Readonly<>` for props: `type Props = Readonly<{ name: string }>`
- Prefer early returns over nested conditionals
- Use Server Components by default; add `"use client"` only when needed

**Error Handling:**
- Use TypeScript's strict null checks
- Use try/catch for async operations
- Avoid `any` type; use `unknown` with type guards

### Python (Bot)

**Configuration:**
- Python 3.11+, strict typing with MyPy
- Ruff for linting (line-length: 100)

**Naming Conventions:**
- Functions/variables: snake_case
- Classes: PascalCase
- Constants: UPPER_SNAKE_CASE

**Type Hints:**
- All functions must have type hints
- Use `from __future__ import annotations` for forward references

### Styling (Tailwind CSS v4)

- Use CSS syntax: `@import "tailwindcss"; @theme inline { ... }`
- Prefer Tailwind utility classes over inline styles
- Use CSS variables for theming (light/dark mode configured)

### Database (Drizzle ORM)

- Define schemas in `db/schema.ts`
- Prefer type-safe Drizzle queries over raw SQL
- Use migrations via `bunx drizzle-kit generate`

### ESLint & Formatting

- **No Prettier** - rely on ESLint for formatting
- ESLint 9 flat config format
- Extends Next.js core-web-vitals and TypeScript rules
- Run `bun run lint` before committing

## Testing

**Frontend:** No test framework configured. Consider:
- Vitest for unit testing
- Playwright for E2E testing

**Backend:** pytest configured:
```bash
pytest                    # Run all tests
pytest -xvs               # Verbose mode
pytest path/to/test.py    # Single test file
pytest -k test_name       # Run tests matching pattern
```

## Project Structure

```
next/              # Next.js frontend
├── app/           # App Router pages
├── db/            # Drizzle schema & migrations
├── public/        # Static assets
└── scripts/       # Utility scripts

bot/               # Python Telegram bot
├── src/           # Source code
└── pyproject.toml # Dependencies & config

db/                # Shared database files
├── schema.ts      # Drizzle ORM schema
└── migrations/    # Database migrations
```

## Important Notes

- Next.js 16 with React 19
- PostgreSQL database (migrated from SQLite)
- Dark mode via `prefers-color-scheme`
- Geist font for typography
- Bun for frontend, UV for Python
