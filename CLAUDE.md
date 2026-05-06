# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Flowstate** is a PWA (Progressive Web App) that lets users voice-dump or type notes, which are then classified by AI (To-Do vs. Reference) and pushed as Markdown files to a GitHub repo (intended for Obsidian sync).

**Stack:** Next.js (App Router), Tailwind CSS, OpenAI API (gpt-4o-mini), Octokit (GitHub REST API), deployed on Vercel.

## Commands

This project has no `package.json` yet — it needs to be initialized as a Next.js app first:

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
# or if already initialized:
npm run dev       # local dev server
npm run build     # production build
npm run lint      # ESLint
```

## Architecture

### Data Flow

1. User enters GitHub token + repo name → stored in `localStorage` via `SettingsForm`
2. User types or speaks a note in `GhostInput` (Page 2)
3. `POST /api/route` receives the raw note text
4. `openAI.ts` classifies it (To-Do or Reference) and generates YAML frontmatter + Markdown body
5. `markdown.ts` assembles the final `.md` file string
6. `github.ts` uses Octokit to push the file to the user's repo
7. `SuccessView` renders on success (Page 3)

### Key Files

| File | Responsibility |
|---|---|
| `src/app/api/route.ts` | Single POST endpoint — orchestrates OpenAI → Markdown → GitHub |
| `src/lib/openAI.ts` | GPT-4o-mini call: classify note type, extract title, generate frontmatter |
| `src/lib/markdown.ts` | Assembles YAML frontmatter + body into final `.md` string |
| `src/lib/github.ts` | Octokit: create/push file to user's repo via GitHub Contents API |
| `src/components/SettingsForm.tsx` | Collects `githubToken` + `repoName`, persists to `localStorage` |
| `src/components/GhostInput.tsx` | Text input or STT capture, submits to `/api/route` |
| `src/components/SuccessView.tsx` | Success screen after note is pushed |
| `public/manifest.json` | PWA manifest for "Add to Home Screen" |

### Markdown Output Format

The AI should produce files compatible with Obsidian YAML frontmatter:

```markdown
---
title: "Note title"
type: todo | reference
date: YYYY-MM-DD
tags: []
---

Note body content here.
```

Files are pushed to the GitHub repo as `notes/YYYY-MM-DD-slug.md` (or similar path) via the GitHub Contents API (`PUT /repos/{owner}/{repo}/contents/{path}`).

### GitHub API (Octokit)

`github.ts` uses `@octokit/rest`. The token and repo come from the request body (forwarded from `localStorage` on the client). File content must be Base64-encoded for the GitHub API.

### PWA

`public/manifest.json` enables "Add to Home Screen". The `layout.tsx` must link to it and include appropriate `<meta>` viewport tags.

## Roles

- **Pat** — `src/lib/github.ts`, `src/lib/markdown.ts`, Octokit integration, YAML frontmatter output
- **Euly** — `src/lib/openAI.ts`, `/api/route.ts`, Whisper STT, AI sorting prompt
- **Isa** — `src/components/`, `src/app/page.tsx`, `src/app/layout.tsx`, UI/UX, PWA manifest
