import { Octokit } from "@octokit/rest";

export interface PushNoteParams {
  token: string;
  owner: string;
  repo: string;
  path: string;       // e.g. "notes/2026-05-05-buy-milk-123456.md"
  content: string;    // raw markdown string
  commitMessage?: string;
}

export async function pushNote({
  token,
  owner,
  repo,
  path,
  content,
  commitMessage,
}: PushNoteParams): Promise<string> {
  const octokit = new Octokit({ auth: token });

  const encoded = Buffer.from(content, "utf-8").toString("base64");
  const message = commitMessage ?? `Add note: ${path.split("/").pop()}`;

  const response = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: encoded,
  });

  return response.data.content?.html_url ?? "";
}

// Splits "owner/repo" string into { owner, repo }
export function parseRepo(repoFullName: string): { owner: string; repo: string } {
  const [owner, repo] = repoFullName.split("/");
  if (!owner || !repo) throw new Error(`Invalid repo format: "${repoFullName}". Expected "owner/repo".`);
  return { owner, repo };
}
