<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- App: a single Next.js 16 (App Router, Turbopack, React 19) front-end — an Arabic RTL clinic-scheduling directory. No backend/database; data comes from static JSON in `app/jsonData/`.
- Standard commands live in `package.json`: `npm run dev` (port 3000), `npm run build`, `npm run lint`.
- Known pre-existing issues in `app/schedule/[id]/page.tsx` (unrelated to environment setup): two `@typescript-eslint/no-explicit-any` lint errors, and a TS comparison error (`item.id == id`) that makes `npm run build` fail type-checking. `npm run dev` runs fine because it does not block on type errors. Do not "fix" these unless the task asks for it.
