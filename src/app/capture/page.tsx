"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

declare global {
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    start(): void;
    stop(): void;
  }

  interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
    readonly isFinal: boolean;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
  }

  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };

  var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };

  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof webkitSpeechRecognition;
  }
}

type Mode = "text" | "mic";

interface LibrarianResult {
  category: "To-Do" | "Reference";
  path: string;
  content: string;
  summary: string;
}

export default function CapturePage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [done, setDone] = useState(false);
  const [resultData, setResultData] = useState<LibrarianResult | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  // Focus textarea when switching to text mode
  useEffect(() => {
    if (mode === "text" && !done && !thinking) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [mode, done, thinking]);

  useEffect(() => {
    return () => {
      if (mode !== "mic" && recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [mode]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setThinking(true);

    try {
      const githubToken = localStorage.getItem("fs_github_token");
      const repoName = localStorage.getItem("fs_repo_name");

      const response = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, githubToken, repoName }),
      });

      if (!response.ok) {
        throw new Error("Failed to process message");
      }

      const data: LibrarianResult = await response.json();
      setResultData(data);
      setThinking(false);
      setDone(true);
    } catch (err) {
      console.error(err);
      setThinking(false);
      // Basic fallback/error handling
      setResultData({
        category: "Reference",
        path: "Error.md",
        content: "An error occurred while processing the note.",
        summary: "Failed to connect or process.",
      });
      setDone(true);
    }
  };

  const startRecording = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      setText(finalTranscript + interimTranscript);
    };

    recognition.onend = () => {
      setRecording(false);
      setMode("text");
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setRecording(false);
      setText('(speech recognition failed — please try again)');
      setMode("text");
    };

    recognition.start();
    recognitionRef.current = recognition;
    setRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setRecording(false);
  };

  const handleReset = () => {
    setDone(false);
    setResultData(null);
    setText("");
    setMode("text");
  };

  // Derive display values from resultData if available
  const displayTitle = resultData?.path.split('/').pop()?.replace('.md', '') || "New Note";
  const displayTags = resultData ? [`#${resultData.category.toLowerCase().replace("-", "")}`] : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        .fs-root { font-family: 'Space Grotesk', sans-serif; }

        .fs-textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 20px;
          font-weight: 500;
          color: #111;
          line-height: 1.5;
          caret-color: #111;
          min-height: 48px;
          overflow: hidden;
        }
        .fs-textarea::placeholder {
          color: #333;
          font-weight: 400;
        }

        .mode-pill {
          display: flex;
          align-items: center;
          background: #F5F5F5;
          border-radius: 999px;
          padding: 4px;
          gap: 2px;
        }
        .mode-btn {
          padding: 6px 16px;
          border-radius: 999px;
          border: none;
          background: transparent;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #555;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.03em;
        }
        .mode-btn.active {
          background: #111;
          color: #FFF;
        }

        .submit-btn {
          transition: opacity 0.15s ease, transform 0.1s ease;
        }
        .submit-btn:active { transform: scale(0.97); opacity: 0.85; }
        .submit-btn:disabled { opacity: 0.2; cursor: not-allowed; }

        .mic-ring {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background: #111;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.2s ease;
          border: none;
        }
        .mic-ring:active { transform: scale(0.94); }
        .mic-ring.recording {
          background: #111;
          animation: pulse 1.2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0px rgba(17,17,17,0.15); }
          50%       { box-shadow: 0 0 0 18px rgba(17,17,17,0.06); }
        }

        .blink { animation: blink 2.5s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.15} }

        .fade-in { animation: fadeIn 0.3s ease forwards; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

        .pop-in {
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }

        .slide-up {
          animation: slideUp 0.4s ease forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .tag-pill {
          display: inline-block;
          background: #F5F5F5;
          color: #333;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          border-radius: 999px;
        }

        .now-btn {
          transition: color 0.15s ease;
        }
        .now-btn:hover { color: #555; }
      `}</style>

      <main className="fs-root w-full h-screen bg-[#FFFFFF] flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-8 pt-12">
          <p className="text-[9px] font-semibold tracking-[.28em] text-[#111] uppercase">
            FlowState
          </p>
          <button
            onClick={() => router.push("/settings")}
            className="text-[11px] text-[#666] font-medium tracking-wide hover:text-[#444] transition-colors"
          >
            settings
          </button>
        </div>

        {!done && !thinking && (
          <div className="flex justify-center mt-8 fade-in">
            <div className="mode-pill">
              <button
                className={`mode-btn ${mode === "text" ? "active" : ""}`}
                onClick={() => setMode("text")}
              >
                type
              </button>
              <button
                className={`mode-btn ${mode === "mic" ? "active" : ""}`}
                onClick={() => setMode("mic")}
              >
                speak
              </button>
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col justify-center px-8">

          {/* INPUT VIEW */}
          {!done && !thinking && mode === "text" && (
            <div className="fade-in flex flex-col gap-6">
              {/* Prompt */}
              <p className="text-[10px] font-semibold tracking-[.2em] text-[#111] uppercase">
                what's on your mind?
              </p>

              {/* Ghost input */}
              <textarea
                ref={textareaRef}
                className="fs-textarea"
                placeholder="just dump it here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
                }}
              />

              {/* Char hint */}
              {text.length > 0 && (
                <p className="text-[10px] text-[#CCC]">
                  ⌘ + enter to send
                </p>
              )}
            </div>
          )}

          {!done && !thinking && mode === "mic" && (
            <div className="fade-in flex flex-col items-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <p className="text-[10px] font-semibold tracking-[.2em] text-[#CCC] uppercase">
                  {recording ? "listening..." : "tap to speak"}
                </p>
                {recording && (
                  <div className="flex items-center gap-1.5">
                    <span className="blink block w-1.5 h-1.5 rounded-full bg-[#111]" />
                    <span className="text-[11px] text-[#444] font-medium">recording</span>
                  </div>
                )}
              </div>

              {/* Mic button */}
              <button
                className={`mic-ring ${recording ? "recording" : ""}`}
                onClick={recording ? stopRecording : startRecording}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="11" rx="3" />
                  <path d="M5 10a7 7 0 0 0 14 0" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="8" y1="22" x2="16" y2="22" />
                </svg>
              </button>

              {/* Transcript display */}
              {text !== null && (
                <div className="w-full max-w-md">
                  <textarea
                    ref={textareaRef}
                    className="fs-textarea"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="your words will appear here..."
                  />
                </div>
              )}

              <p className="text-[11px] text-[#CCC] text-center leading-relaxed">
                tap to start —<br />we'll transcribe in real-time
              </p>
            </div>
          )}

          {/* THINKING VIEW */}
          {thinking && (
            <div className="fade-in flex flex-col items-center justify-center gap-4">
              <span className="blink block w-3 h-3 rounded-full bg-[#111]" />
              <p className="text-xs text-[#444] font-medium tracking-wide">
                sorting your thoughts...
              </p>
            </div>
          )}

          {/* RESULT VIEW */}
          {done && resultData && (
            <div className="flex flex-col items-center justify-center gap-8 w-full max-w-md mx-auto">
              {/* Check mark */}
              <div
                className="pop-in w-20 h-20 rounded-full bg-[#111] flex items-center justify-center"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              {/* Title */}
              <div
                className="slide-up text-center flex flex-col gap-1"
                style={{ animationDelay: "100ms", opacity: 0 }}
              >
                <h1 className="text-[26px] font-bold text-[#111] tracking-[-0.02em] leading-snug">
                  filed.
                </h1>
                <p className="text-[#BBB] text-sm font-medium">
                  your thought is in the vault.
                </p>
              </div>

              {/* Note preview card */}
              <div
                className="slide-up w-full rounded-2xl border border-[#F0F0F0] bg-[#FAFAFA] p-5 flex flex-col gap-3"
                style={{ animationDelay: "200ms", opacity: 0 }}
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-bold text-[#111] leading-snug truncate">
                    {displayTitle}
                  </p>
                  <span className="tag-pill shrink-0">{resultData.category}</span>
                </div>

                {/* Preview text */}
                <p className="text-[12px] text-[#444] leading-relaxed line-clamp-3">
                  {resultData.summary || resultData.content}
                </p>

                {/* Tags */}
                <div className="flex gap-2 flex-wrap">
                  {displayTags.map((tag) => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>

                {/* Filename */}
                <div className="border-t border-[#EBEBEB] pt-3 flex items-center gap-2 mt-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <polyline points="13 2 13 9 20 9" />
                  </svg>
                  <p className="text-[10px] text-[#CCC] font-mono tracking-wide truncate">
                    {resultData.path}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom CTA */}
        <div className="px-8 pb-12 flex flex-col items-center gap-4">
          {!done && !thinking && mode === "text" && (
            <button
              className="submit-btn w-full py-3.5 bg-[#111] text-white rounded-2xl text-sm font-semibold tracking-wide"
              onClick={handleSubmit}
              disabled={!text.trim()}
            >
              send to vault →
            </button>
          )}

          {done && (
            <div
              className="fade-in w-full flex flex-col items-center"
              style={{ animationDelay: "300ms", opacity: 0 }}
            >
              <button
                className="submit-btn w-full py-3.5 bg-[#111] text-white rounded-2xl text-sm font-semibold tracking-wide shadow-sm mb-3"
                onClick={handleReset}
              >
                capture another note
              </button>
              <button
                className="now-btn text-[11px] text-[#BBB] font-semibold"
                onClick={() => router.push("/")}
              >
                back to home
              </button>
            </div>
          )}
        </div>

      </main>
    </>
  );
}