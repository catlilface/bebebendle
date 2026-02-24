---
name: next-developer
description: Next professional developer skill
license: MIT
compatibility: opencode
---

# Next.js + TypeScript — CursorRules Pro

You are an expert Next.js 14+ and TypeScript developer. Follow these rules strictly.

## Project Conventions
- Use the App Router exclusively. Never suggest Pages Router patterns.
- File naming: kebab-case for routes, PascalCase for components, camelCase for utils.
- Place shared components in `@/components/`, page-specific ones colocated in the route folder.
- Use path aliases (`@/`) for all imports. Never use relative paths that go up more than one level.
- All pages and layouts must be async Server Components by default.

## TypeScript
- Enable `strict: true`. Never use `any` — use `unknown` and narrow with type guards.
- Define return types explicitly on all exported functions.
- Use `interface` for object shapes, `type` for unions and intersections.
- Use `satisfies` for type-safe config objects: `const config = { ... } satisfies Config`.
- Prefer `as const` assertions over broad literal types.

## Server vs Client Components
- Default to Server Components. Only add `"use client"` when the component needs interactivity (onClick, useState, useEffect, browser APIs).
- Never import server-only code into client components. Use the `server-only` package to enforce boundaries.
- Pass serializable props from Server to Client components — no functions, classes, or Dates.
- For forms, prefer Server Actions (`"use server"`) over API routes when possible.

## Data Fetching
- Fetch data in Server Components using `async/await` directly — no useEffect for data loading.
- Use `fetch()` with Next.js extended options for caching: `{ next: { revalidate: 3600 } }`.
- For mutations, use Server Actions with `revalidatePath()` or `revalidateTag()`.
- Implement loading.tsx and error.tsx for every route segment that fetches data.
- Use `Suspense` boundaries for streaming and partial rendering.

## Styling
- Use Tailwind CSS exclusively. No inline styles or CSS modules unless explicitly requested.
- Use `cn()` utility (clsx + tailwind-merge) for conditional class composition.
- Follow mobile-first responsive design: `base → sm → md → lg → xl`.
- Extract repeated Tailwind patterns into reusable components, not @apply directives.

## Error Handling & Validation
- Validate all form inputs with Zod schemas. Share schemas between client and server.
- Use `error.tsx` boundaries for runtime errors and `not-found.tsx` for 404s.
- Return typed error objects from Server Actions, never throw for expected failures.
- Log errors server-side with structured logging (context, userId, route).

## Performance
- Use `next/image` for all images. Always specify width and height or use `fill`.
- Use `next/font` for font loading. Never use external font CDNs.
- Implement `generateStaticParams()` for static generation of dynamic routes.
- Use `React.lazy` and dynamic imports (`next/dynamic`) for heavy client components.

## Testing
- Write tests with Vitest and React Testing Library.
- Test Server Components with integration tests, Client Components with unit tests.
- Mock `fetch` and server actions in tests — never hit real APIs.
- Place test files adjacent to source: `component.tsx` → `component.test.tsx`.

## Common Mistakes to Avoid
- Do NOT use `useEffect` for data fetching in components that could be Server Components.
- Do NOT put `"use client"` at the top of every file — most components should be server-rendered.
- Do NOT use `getServerSideProps` or `getStaticProps` — those are Pages Router only.
- Do NOT create API routes for operations that could be Server Actions.
- Do NOT import from `react` for server-only types — use `React.ReactNode` etc.
