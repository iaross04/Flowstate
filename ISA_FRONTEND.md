# Flowstate — Frontend Integration Guide (Isa)

The backend pipeline is fully working. This document covers exactly what needs to change in the UI and how to wire everything together.

---

## What the API does (don't touch `src/app/api/route.ts`)

**Endpoint:** `POST /api`

**Request body:**
```json
{
  "message": "Buy groceries tomorrow",
  "githubToken": "ghp_...",
  "repoName": "owner/repo"
}
```
- `message` is required.
- `githubToken` and `repoName` are optional — if omitted, the API still classifies the note but skips the GitHub push.

**Response (success):**
```json
{
  "category": "To-Do",
  "path": "Tasks/Shopping/buy-groceries-tomorrow.md",
  "content": "---\ndate_created: ...\n---\n\n# Buy Groceries\n...",
  "summary": "Creating a to-do to buy groceries for tomorrow.",
  "githubUrl": "https://github.com/iaross04/Flowstate/blob/main/notes/Tasks/Shopping/buy-groceries-tomorrow.md"
}
```
- `githubUrl` is only present when the token + repo were provided and the push succeeded.
- `path` is the relative path inside the `notes/` folder in the repo (e.g. `Tasks/Shopping/buy-groceries-tomorrow.md`). The full repo path is `notes/{path}`.

**Response (error):**
```json
{ "error": "some message" }
```
HTTP status will be `400` (bad input) or `500` (API/GitHub failure).

---

## Task 1 — Fix `SettingsForm.tsx`

The current form has wrong fields (`vaultPath`, `autoSync`, etc.). Replace it with two fields: **GitHub Token** and **Repo Name**, saved to `localStorage`.

**Replace the entire component with this:**

```tsx
"use client";

import React, { useEffect, useState } from "react";

interface SettingsFormProps {
  onSave?: () => void;
  onCancel?: () => void;
}

export default function SettingsForm({ onSave, onCancel }: SettingsFormProps) {
  const [token, setToken] = useState("");
  const [repo, setRepo] = useState("");

  // Pre-fill from localStorage on mount
  useEffect(() => {
    setToken(localStorage.getItem("githubToken") ?? "");
    setRepo(localStorage.getItem("repoName") ?? "");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("githubToken", token.trim());
    localStorage.setItem("repoName", repo.trim());
    onSave?.();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        GitHub Token
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ghp_..."
          autoComplete="off"
        />
      </label>

      <label>
        GitHub Repo
        <input
          type="text"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="owner/repo"
        />
      </label>

      <button type="button" onClick={onCancel}>Cancel</button>
      <button type="submit">Save</button>
    </form>
  );
}
```

Style it however fits the design — the logic above is what matters.

**How to get a GitHub token (tell the user in the UI or docs):**
Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token → check the `repo` scope only.

---

## Task 2 — Wire `ChatInterface.tsx` to send credentials

The fetch call in `ChatInterface` currently only sends `{ message }`. It needs to also send the saved credentials from `localStorage`.

**Find this block in `src/components/ChatInterface.tsx` (~line 46):**
```tsx
body: JSON.stringify({ message: input }),
```

**Replace it with:**
```tsx
body: JSON.stringify({
  message: input,
  githubToken: localStorage.getItem("githubToken") ?? undefined,
  repoName: localStorage.getItem("repoName") ?? undefined,
}),
```

That's the only change needed for the GitHub push to work.

---

## Task 3 — Show the GitHub link on success

The API response now includes `githubUrl`. The `LibrarianResult` interface in `ChatInterface.tsx` needs to know about it, and the UI should show it.

**Update the `LibrarianResult` interface (~line 16) to add `githubUrl`:**
```tsx
interface LibrarianResult {
  category: "To-Do" | "Reference";
  path: string;
  content: string;
  summary: string;
  githubUrl?: string; // add this
}
```

**Then in the AI message render**, wherever `result.summary` or the result card is displayed, add a link if `githubUrl` is present:
```tsx
{result.githubUrl && (
  <a href={result.githubUrl} target="_blank" rel="noopener noreferrer">
    View in GitHub →
  </a>
)}
```

The existing `SuccessView` component and `ResultDisplay` component are both usable here — pick whichever fits your layout. If you use `SuccessView`, pass:
```tsx
<SuccessView
  summary={result.summary}
  path={`notes/${result.path}`}   // prefix with notes/ for the actual repo path
  category={result.category}
  onDismiss={() => { /* reset state */ }}
/>
```

---

## Task 4 — Add a Settings button to open `SettingsForm`

`SettingsForm` currently isn't rendered anywhere. Add a gear/settings button in `ChatInterface`'s header area that toggles a settings panel:

```tsx
const [showSettings, setShowSettings] = useState(false);

// In JSX:
<button onClick={() => setShowSettings(true)}>Settings</button>

{showSettings && (
  <SettingsForm
    onSave={() => setShowSettings(false)}
    onCancel={() => setShowSettings(false)}
  />
)}
```

---

## Task 5 — PWA: add manifest link to `layout.tsx`

`public/manifest.json` exists but `layout.tsx` doesn't link to it. Add to the `<head>`:

```tsx
export const metadata: Metadata = {
  title: "Flowstate",
  description: "Smart note capture and organization",
};
```

Since you're using the App Router, add viewport and manifest via the `<head>` in `layout.tsx`:

```tsx
<html lang="en">
  <head>
    <link rel="manifest" href="/manifest.json" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#000000" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  </head>
  <body>{children}</body>
</html>
```

---

## Optional — Use `GhostInput` instead of the inline input

`GhostInput` exists but `ChatInterface` has its own inline `<input>`. To use it:

```tsx
import GhostInput from "./GhostInput";

// Replace the <form> input with:
<GhostInput
  value={input}
  onChange={setInput}
  onSubmit={(val) => {
    setInput(val);
    handleSendMessage(); // trigger submit
  }}
  disabled={isLoading}
/>
```

Note: `GhostInput.onSubmit` fires on Enter, so you may need to refactor `handleSendMessage` to accept the value directly rather than reading from state.

---

## Summary of changes

| File | What to change |
|---|---|
| `SettingsForm.tsx` | Replace fields with `githubToken` + `repoName`, read/write `localStorage` |
| `ChatInterface.tsx` | Add `githubToken`/`repoName` to fetch body; add `githubUrl?` to interface; render GitHub link; add Settings button |
| `layout.tsx` | Add `<link rel="manifest">` and PWA meta tags |
| *(optional)* `ChatInterface.tsx` | Use `GhostInput` component instead of inline input |

No changes needed to any `src/lib/` or `src/app/api/` files.
