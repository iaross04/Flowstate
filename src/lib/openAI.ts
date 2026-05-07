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
    // Try to get API key from environment variables (Vercel/production)
    // Falls back to hardcoded key for PWA/local testing
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 
                   process.env.GEMINI_API_KEY ||
                   "AIzaSyDs5gbVIOz8QCv3ss0wLckAoyFHA0i4xw0";

    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }

    const prompt = generateLibrarianPrompt(userMessage);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent`,
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
    if (axios.isAxiosError(error) && error.response) {
      const geminiError = error.response.data?.error;
      throw new Error(
        `Gemini ${error.response.status}: ${geminiError?.message ?? error.response.statusText} (status: ${geminiError?.status ?? "unknown"})`
      );
    }
    throw error;
  }
}
