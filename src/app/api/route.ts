import { NextResponse } from "next/server";
import { processWithObsidianLibrarian } from "../../lib/openAI";
import { parseRepo, pushNote } from "../../lib/github";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, githubToken, repoName } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing or invalid message." }, { status: 400 });
    }

    const result = await processWithObsidianLibrarian(message);

    let githubUrl: string | null = null;
    if (githubToken && repoName) {
      const { owner, repo } = parseRepo(repoName);
      const filePath = result.path.startsWith("notes/") ? result.path : `notes/${result.path}`;
      githubUrl = await pushNote({
        token: githubToken,
        owner,
        repo,
        path: filePath,
        content: result.content,
      });
    }

    return NextResponse.json({ ...result, githubUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
