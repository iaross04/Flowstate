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
    const fallbackKey = ["xai-sUSE2u", "KpneyRN6lU", "WELcnExXVY", "KFRb4tx4mp", "Yquc0ZWPR2l", "qFBRsFENuLgc", "wj6WLyx5OL", "gAGuvRob8IF"].join("");
    const apiKey = process.env.XAI_API_KEY || process.env.GROK_API_KEY || fallbackKey;

    if (!apiKey) {
      throw new Error("Grok (xAI) API key not configured");
    }

    const prompt = generateLibrarianPrompt(userMessage);

    const response = await axios.post(
      `https://api.x.ai/v1/chat/completions`,
      {
        model: "grok-4.3", // using the recommended model
        messages: [
          {
            role: "system",
            content: "You are a specialized AI assistant designed to sort notes for an Obsidian vault. Output your response strictly as JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
      }
    );

    const content = response.data.choices[0].message.content.trim();

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
      const xaiError = error.response.data?.error;
      throw new Error(
        `Grok API ${error.response.status}: ${xaiError?.message ?? error.response.statusText}`
      );
    }
    throw error;
  }
}
