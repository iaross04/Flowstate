export type NoteType = "todo" | "reference";

export interface NoteData {
  title: string;
  type: NoteType;
  body: string;
  tags?: string[];
  date?: string; // YYYY-MM-DD, defaults to today
}

export function buildMarkdown(note: NoteData): string {
  const date = note.date ?? new Date().toISOString().split("T")[0];
  const tags = note.tags ?? [];
  const tagList = tags.map((t) => `"${t}"`).join(", ");

  return `---
title: "${note.title}"
type: ${note.type}
date: ${date}
tags: [${tagList}]
---

${note.body.trim()}
`;
}

export function buildFilePath(title: string, date?: string): string {
  const d = date ?? new Date().toISOString().split("T")[0];
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
  const timestamp = Date.now();
  return `notes/${d}-${slug}-${timestamp}.md`;
}
