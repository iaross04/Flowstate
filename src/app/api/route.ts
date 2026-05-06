import { NextRequest, NextResponse } from "next/server";
import { processWithObsidianLibrarian } from "../../lib/openAI";

/**
 * POST /api
 * 
 * Processes a user message through the Obsidian Librarian AI
 * and returns categorized, structured JSON for vault organization.
 * 
 * Using: Google Gemini API (gemini-flash-latest)
 */
export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const result = await processWithObsidianLibrarian(message);

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to process message";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
