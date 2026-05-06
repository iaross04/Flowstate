/**
 * End-to-end pipeline test: Gemini classification → GitHub push
 *
 * Usage:
 *   npm run test:pipeline
 *   npm run test:pipeline -- "your custom note here"
 *
 * Required env vars (set in .env.local):
 *   NEXT_PUBLIC_GEMINI_API_KEY  — Gemini API key
 *   GITHUB_TOKEN                — Personal access token (repo scope)
 *   GITHUB_REPO                 — Target repo in "owner/repo" format
 */

import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { processWithObsidianLibrarian } from "../src/lib/openAI";
import { pushNote, parseRepo } from "../src/lib/github";

const TEST_MESSAGE =
  process.argv[2] ?? "Remind me to review the Flowstate PR before Thursday";

async function main() {
  console.log("=== Flowstate Pipeline Test ===\n");
  console.log(`Input: "${TEST_MESSAGE}"\n`);

  // Step 1: Gemini classification
  console.log("Step 1 — Gemini classification...");
  const result = await processWithObsidianLibrarian(TEST_MESSAGE);
  console.log("  category:", result.category);
  console.log("  path:    ", result.path);
  console.log("  summary: ", result.summary);
  console.log("  content preview:");
  console.log(
    result.content
      .split("\n")
      .slice(0, 8)
      .map((l) => "    " + l)
      .join("\n")
  );
  console.log("");

  // Step 2: GitHub push
  const token = process.env.GITHUB_TOKEN;
  const repoName = process.env.GITHUB_REPO;

  if (!token || !repoName) {
    console.log(
      "Step 2 — GitHub push SKIPPED (GITHUB_TOKEN or GITHUB_REPO not set in .env.local)"
    );
    console.log("\n  To test the full pipeline, add to .env.local:");
    console.log("    GITHUB_TOKEN=ghp_yourtoken");
    console.log("    GITHUB_REPO=owner/repo");
    return;
  }

  console.log(`Step 2 — Pushing to GitHub (${repoName})...`);
  const { owner, repo } = parseRepo(repoName);
  const filePath = `notes/${result.path}`;
  const url = await pushNote({
    token,
    owner,
    repo,
    path: filePath,
    content: result.content,
  });

  console.log("  Success!");
  console.log("  File URL:", url);
  console.log("\n=== Pipeline OK ===");
}

main().catch((err) => {
  console.error("\nPipeline FAILED:", err.message ?? err);
  process.exit(1);
});
