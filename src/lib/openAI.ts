import axios from "axios";
import { generateLibrarianPrompt } from "./obsidianPrompt";

interface LibrarianResponse {
  category: "To-Do" | "Reference";
  path: string;
  content: string;
  summary: string;
}

export async function processWithObsidianLibrarian(
  userMessage: string
): Promise<LibrarianResponse> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }

    const prompt = generateLibrarianPrompt(userMessage);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
      }
    );

    const content = response.data.candidates[0].content.parts[0].text.trim();

    // Parse the JSON response
    const jsonStart = content.indexOf("{");
    const jsonEnd = content.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error("Invalid JSON response from AI");
    }

    const jsonString = content.substring(jsonStart, jsonEnd);
    const result: LibrarianResponse = JSON.parse(jsonString);

    return result;
  } catch (error) {
    console.error("Error processing with Obsidian Librarian:", error);
    throw error;
  }
}
