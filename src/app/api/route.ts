import { NextRequest, NextResponse } from "next/server";
import { processWithObsidianLibrarian } from "../../lib/openAI";
import { pushNote, parseRepo } from "../../lib/github";

export async function POST(request: NextRequest) {
  try {
    const { message, githubToken, repoName } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const result = await processWithObsidianLibrarian(message);

    let githubUrl: string | undefined;
    if (githubToken && repoName) {
      const { owner, repo } = parseRepo(repoName);
      const filePath = `notes/${result.path}`;
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
    console.error("API Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to process message";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
