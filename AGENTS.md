# AGENTS.md

Guidelines for agentic coding agents working in the bebebendle repository.

## Project Overview

**Monorepo:** Next.js frontend + Python Telegram bot + PostgreSQL (Docker)

**Services:**
- `next/` - Next.js 16 + React 19 + TypeScript
- `bot/` - Python 3.11 + aiogram
- `db/` - PostgreSQL 15 (Docker container)

## Build, Lint, and Test Commands

### Frontend (Next.js)
**Package Manager:** Bun

```bash
# Development (in next/ directory)
bun run dev              # Start dev server

# Build & Deploy
bun run build            # Build production
make up-build           # Docker: build & start all services

# Linting
bun run lint            # Run ESLint
bun run lint --fix      # Auto-fix ESLint
```

### Python Bot
**Package Manager:** UV

```bash
# Development (in bot/ directory)
uv sync                 # Install dependencies
uv run python src/main.py  # Run bot locally

# Linting & Type Checking
ruff check .            # Run Ruff linter
ruff check --fix .      # Auto-fix issues
mypy src/               # Run MyPy type checker

# Testing
pytest                  # Run all tests
pytest -xvs             # Verbose output
pytest -xvs test_file.py::test_func  # Single test
```

### Database & Docker

```bash
# Database
make migrate            # Run Drizzle migrations
make generate-migration # Generate new migration

# Docker Operations
make up                 # Start all services
make down               # Stop all services
make logs-frontend      # View frontend logs
make logs-bot           # View bot logs
make shell-frontend     # Open shell in frontend container
```

## Code Style Guidelines

### TypeScript (Frontend)

**Configuration:**
- Target: ES2017, Strict mode
- Module: ESNext with bundler resolution
- JSX: react-jsx (no React import needed)

**Imports:**
- Use `@/*` alias: `import { db } from "@/db/schema"`
- Prefer named imports

**Naming Conventions:**
- Components: PascalCase (`UserProfile.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Directories: kebab-case (`user-profile/`)
- Configs: kebab-case (`eslint.config.mjs`)

**React Patterns:**
- Functional components with explicit return types
- Use `Readonly<>` for props: `type Props = Readonly<{ name: string }>`
- Prefer early returns
- Server Components by default; add `"use client"` only when needed

**Error Handling:**
- Strict null checks
- Try/catch for async operations
- Avoid `any`; use `unknown` with type guards

### Python (Bot)

**Configuration:**
- Python 3.11+, MyPy strict typing
- Ruff linting (line-length: 100)

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
- CSS variables for theming

### Database (Drizzle ORM)

- Define schemas in `next/db/schema.ts`
- Prefer type-safe Drizzle queries
- Use migrations via `bunx drizzle-kit generate`

### ESLint & Formatting

- **No Prettier** - rely on ESLint
- ESLint 9 flat config
- Extends Next.js core-web-vitals and TypeScript rules
- Run `bun run lint` before committing

## Testing

**Frontend:** No test framework configured

**Backend:** pytest configured:
```bash
pytest                  # Run all tests
pytest -xvs             # Verbose mode
pytest -k test_name     # Run tests matching pattern
```

## Project Structure

```
next/                   # Next.js frontend
├── app/               # App Router pages
│   ├── admin/        # Admin panel
│   ├── api/          # API routes
│   ├── components/   # React components
│   └── lib/          # Utility functions
├── db/               # Drizzle schema & migrations
├── public/           # Static assets
└── scripts/          # Utility scripts

bot/                   # Python Telegram bot
├── src/              # Source code
│   ├── main.py       # Bot handlers
│   └── database.py   # Database operations
└── pyproject.toml    # Dependencies & config
```

## Important Notes

- Next.js 16 with React 19
- PostgreSQL via Docker (was SQLite)
- Dark mode via `prefers-color-scheme`
- Geist font for typography
- Bun for frontend, UV for Python
