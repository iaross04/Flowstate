/**
 * Whisper API client for speech-to-text transcription
 * Uses OpenAI's Whisper API via next-server to avoid exposing API keys to client
 */

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");

    const response = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Transcription failed: ${errorData.error || response.statusText}`
      );
    }

    const data = await response.json();
    return data.transcript;
  } catch (error) {
    console.error("Whisper transcription error:", error);
    throw error;
  }
}
