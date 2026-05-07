"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const validateToken = async (token: string, repo: string): Promise<boolean> => {
  try {
    const [owner, name] = repo.split('/');
    if (!owner || !name) return false;
    const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
      headers: { Authorization: `token ${token}` }
    });
    return res.ok;
  } catch {
    return false;
  }
};

export default function LandingPage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check for stored credentials
    const token = localStorage.getItem("fs_github_token");
    const repo = localStorage.getItem("fs_repo_name");
    
    if (token && repo) {
      // Validate the stored token
      setChecking(true);
      validateToken(token, repo).then((isValid) => {
        if (isValid) {
          // Token is valid, go directly to capture
          router.push("/capture");
          return;
        }
        // Token is invalid, show landing page
        setChecking(false);
        setShowSplash(true);
        const fadeTimer = setTimeout(() => setFadeOut(true), 1000);
        const removeTimer = setTimeout(() => {
          setShowSplash(false);
        }, 1500);
        return () => {
          clearTimeout(fadeTimer);
          clearTimeout(removeTimer);
        };
      });
    } else {
      // No credentials, show landing page
      setShowSplash(true);
      const fadeTimer = setTimeout(() => setFadeOut(true), 1000);
      const removeTimer = setTimeout(() => {
        setShowSplash(false);
      }, 1500);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [router]);

  // Avoid flashes during initial server load or while checking token
  if (!isClient || checking) {
    return <div className="w-full h-screen bg-[#FFFFFF]" />;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        .fs-root { font-family: 'Space Grotesk', sans-serif; }
        .blink { animation: blink 2.5s ease-in-out forwards; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.15} }
        .btn-primary {
          transition: opacity 0.15s ease, transform 0.1s ease;
        }
        .btn-primary:active { transform: scale(0.97); opacity: 0.85; }
        .btn-skip {
          transition: color 0.15s ease;
        }
        .btn-skip:hover { color: #444; }
        
        .splash-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background-color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .splash-logo {
          width: 250px;
          height: 250px;
          object-fit: contain;
          opacity: 0.85; /* Lower opacity so it's not super pop */
          transition: opacity 0.5s ease-out; /* Simple fade out transition */
        }
        .splash-fade-out .splash-logo {
          opacity: 0;
        }
      `}</style>

      {/* Splash Screen */}
      {showSplash && (
        <div className={`splash-screen ${fadeOut ? "splash-fade-out" : ""}`}>
          <img
            src="/animation/logo.png"
            alt="FlowState Logo"
            className="splash-logo"
          />
        </div>
      )}

      {/* Main Landing Page (Hidden from screen readers while splash is active) */}
      <main
        className="fs-root w-full h-screen bg-[#FFFFFF] flex flex-col overflow-hidden"
        aria-hidden={showSplash ? "true" : "false"}
      >
        {/* Top pill */}
        <div className="flex justify-center pt-12">
          <div className="flex items-center gap-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-full px-4 py-1.5 shadow-sm">
            <span className="blink block w-1.5 h-1.5 rounded-full bg-[#111]" />
            <span className="text-[10px] font-semibold text-[#333] uppercase tracking-[.2em]">
              AI-powered notes
            </span>
          </div>
        </div>

        {/* GIF */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src="/animation/CrashOut.gif"
            alt="FlowState"
            className="w-52 h-52 object-contain"
          />
        </div>

        {/* Bottom text + CTA */}
        <div className="px-8 pb-12 flex flex-col items-center gap-6">
          {/* Text block */}
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-[9px] font-semibold tracking-[.28em] text-[#333] uppercase mb-1">
              FlowState
            </p>
            <h1 className="text-[26px] font-bold text-[#111] leading-snug tracking-[-0.02em]">
              think out loud.
            </h1>
            <h1 className="text-[26px] font-bold text-[#bbb] leading-snug tracking-[-0.02em]">
              we'll sort it out.
            </h1>
          </div>

          {/* Buttons */}
          <div className="w-full flex flex-col items-center gap-3">
            <button
              onClick={() => router.push("/onboarding")}
              className="btn-primary w-full py-3.5 bg-[#111] text-white rounded-2xl text-sm font-semibold tracking-wide"
            >
              Get Started
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
