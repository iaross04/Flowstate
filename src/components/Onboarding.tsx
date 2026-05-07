"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AsciiMotionBulb = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFrame((f) => f + 1);
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  const chars = [" ", "·", "K", "■"];
  
  // Hand-tuned silhouette for a perfect lightbulb shape
  const widths = [
    5,  // 0: top
    7,  // 1
    9,  // 2
    10, // 3
    11, // 4 (widest)
    11, // 5
    11, // 6
    10, // 7
    9,  // 8
    7,  // 9
    6,  // 10
    5,  // 11
    4,  // 12
    4,  // 13
    4,  // 14
    4,  // 15 (neck)
    3,  // 16 (base start)
    3,  // 17
    2,  // 18 (base tip)
  ];

  let ascii = "";
  for (let y = 0; y < 19; y++) {
    let row = "";
    for (let x = 0; x < 38; x++) {
      const cx = 19;
      const cy = 7;
      const dx = Math.abs(x - cx);
      
      let inBulb = false;
      let inBase = false;
      if (y < widths.length) {
        if (y >= 16) {
          if (dx <= widths[y]) inBase = true;
        } else {
          if (dx <= widths[y]) inBulb = true;
        }
      }
      
      const time = frame * 0.15;
      const n1 = Math.sin((x - cx) * 0.4 + time);
      const n2 = Math.cos((y - cy) * 0.5 - time);
      const n3 = Math.sin((x - cx + y) * 0.3 + time * 1.2);
      let noise = (n1 + n2 + n3) / 3; 

      let intensity = 0;

      if (inBulb) {
        intensity = 0.5 + noise * 0.5; 
        if (dx === widths[y] || dx === widths[y] - 1) intensity += 0.3; // edge glow
      } else if (inBase) {
        intensity = 0.8 + noise * 0.2;
      } else {
        intensity = 0; // completely empty background
        const dist = Math.sqrt((x-cx)*(x-cx)*0.3 + (y-cy)*(y-cy));
        const angle = Math.atan2(y-cy, x-cx);
        const ray = Math.sin(angle * 6 + time) * Math.cos(dist * 0.4 - time);
        if (ray > 0.8 && dist < 12) intensity = 0.3; // faint rays
      }

      let charIdx = 0;
      if (intensity > 0.8) charIdx = 3;
      else if (intensity > 0.5) charIdx = 2;
      else if (intensity > 0.2) charIdx = 1;
      else charIdx = 0;
      
      row += chars[charIdx];
    }
    ascii += row + "\n";
  }

  return (
    <pre 
      className="slide-in" 
      style={{ 
        animationDelay: '0.2s', 
        lineHeight: '10px', 
        fontFamily: 'monospace', 
        fontSize: '10px', 
        color: '#FFF', 
        textShadow: '0 0 5px rgba(255,255,255,0.2)',
        opacity: 0.7,
        letterSpacing: '0.1em',
        margin: 0
      }}
    >
      {ascii}
    </pre>
  );
};

const AsciiMotionProcess = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFrame((f) => f + 1);
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  const chars = [" ", "·", "K", "■"];
  
  let ascii = "";
  for (let y = 0; y < 19; y++) {
    let row = "";
    for (let x = 0; x < 38; x++) {
      let inShape = false;
      const mx = 19;
      const dx = Math.abs(x - mx);
      
      const isMic = Math.floor(frame / 40) % 2 === 0;

      if (isMic) {
        // Microphone Capsule
        if (y >= 2 && y <= 8 && dx <= 3) {
          if (y === 2 && dx <= 1) inShape = true;
          else if (y === 8 && dx <= 1) inShape = true;
          else if (y >= 3 && y <= 7) inShape = true;
        }
        
        // U-Bracket
        if (y >= 5 && y <= 9 && dx === 5) inShape = true;
        if (y === 10 && dx >= 1 && dx <= 5) inShape = true;
        
        // Stand
        if (y >= 11 && y <= 15 && dx <= 1) inShape = true;
        
        // Base
        if (y === 16 && dx <= 4) inShape = true;
        if (y === 17 && dx <= 6) inShape = true;
      } else {
        // Slanted Pencil with writing motion
        const wiggle = Math.sin(frame * 0.4) * 2; // moves left and right
        const px1 = 26 + wiggle;
        const py1 = 2;
        const px2 = 16 + wiggle;
        const py2 = 12;
        
        const ABx = px2 - px1;
        const ABy = py2 - py1;
        const APx = x - px1;
        const APy = y - py1;
        const len2 = ABx*ABx + ABy*ABy;
        let t = (APx*ABx + APy*ABy) / len2;
        
        t = Math.max(-0.1, Math.min(1.2, t));
        const cx = px1 + t * ABx;
        const cy = py1 + t * ABy;
        const distToLine = Math.sqrt((x-cx)*(x-cx)*0.6 + (y-cy)*(y-cy)); // 0.6 aspect ratio correction for diagonal
        
        if (t < 0) {
          // Eraser
          if (distToLine < 2.5) inShape = true;
        } else if (t >= 0 && t <= 1) {
          // Body
          if (distToLine < 2.5) inShape = true;
        } else if (t > 1 && t <= 1.2) {
          // Tip cone
          const tipProgress = (t - 1) / 0.2; 
          const tipWidth = 2.5 * (1 - tipProgress);
          if (distToLine <= tipWidth) inShape = true;
        }
      }
      
      const time = frame * 0.15;
      const n1 = Math.sin((x - mx) * 0.4 + time);
      const n2 = Math.cos(y * 0.5 - time);
      const n3 = Math.sin((x + y) * 0.3 + time * 1.2);
      let noise = (n1 + n2 + n3) / 3; 

      let intensity = 0;

      if (inShape) {
        intensity = 0.5 + noise * 0.5; 
        if (isMic && y >= 3 && y <= 7 && dx === 3) intensity += 0.2; // edge glow for capsule
      } else {
        intensity = 0; 
        
        // Constant ambient waves from the center (19, 9) so the overall ASCII shape never changes
        const dist = Math.sqrt((x-19)*(x-19)*0.4 + (y-9)*(y-9));
        const wave = Math.sin(dist * 0.8 - time * 1.5);
        if (wave > 0.85 && dist > 5 && dist < 14) {
          intensity = 0.3; // faint ambient dots
        }
      }

      let charIdx = 0;
      if (intensity > 0.8) charIdx = 3;
      else if (intensity > 0.5) charIdx = 2;
      else if (intensity > 0.2) charIdx = 1;
      else charIdx = 0;
      
      row += chars[charIdx];
    }
    ascii += row + "\n";
  }

  return (
    <pre 
      className="slide-in" 
      style={{ 
        animationDelay: '0.2s', 
        lineHeight: '10px', 
        fontFamily: 'monospace', 
        fontSize: '10px', 
        color: '#FFF', 
        textShadow: '0 0 5px rgba(255,255,255,0.2)',
        opacity: 0.7,
        letterSpacing: '0.1em',
        margin: 0
      }}
    >
      {ascii}
    </pre>
  );
};

const STEPS = [
  {
    id: "welcome",
    title: "welcome to flowstate.",
    description: "capture notes at the speed of thought, without breaking your flow.",
    type: "info",
  },
  {
    id: "process",
    title: "how it works.",
    description: "speak or type your thoughts. the ai automatically sorts them, then pushes directly to your github repository to seamlessly sync with your obsidian vault.",
    type: "info",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    githubToken: "",
    repoName: "",
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Auto-fill existing keys if any (useful for testing or partial setups)
    setValues({
      githubToken: localStorage.getItem("fs_github_token") || "",
      repoName: localStorage.getItem("fs_repo_name") || "",
    });
  }, []);

  const currentStep = STEPS[step];
  const isLastStep = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      // Save all to localStorage
      localStorage.setItem("fs_github_token", values.githubToken);
      localStorage.setItem("fs_repo_name", values.repoName);

      // Redirect to settings
      router.push("/settings");
    } else {
      setStep((s) => s + 1);
    }
  };

  if (!isClient) {
    return <div className="w-full h-screen bg-neutral-950" />;
  }

  // Dots indicator
  const dots = STEPS.map((_, i) => (
    <span
      key={i}
      style={{
        display: "inline-block",
        width: i === step ? "24px" : "6px",
        height: "6px",
        borderRadius: "999px",
        background: i === step ? "#FFFFFF" : "#333",
        transition: "all 0.3s ease",
      }}
    />
  ));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        .fs-root { font-family: 'Space Grotesk', sans-serif; }
        
        .onboarding-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1.5px solid #333;
          border-radius: 0;
          padding: 12px 0;
          font-size: 16px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 500;
          color: #FFF;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease;
          caret-color: #FFF;
        }
        .onboarding-input:focus { border-bottom-color: #FFF; }
        .onboarding-input::placeholder { color: #555; font-weight: 400; }
        
        .slide-in {
          animation: slideIn 0.3s ease forwards;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main className="fs-root w-full h-screen bg-neutral-950 text-white flex flex-col overflow-hidden">

        {/* Top Navigation / Progress */}
        <div className="flex items-center justify-between px-8 pt-12">
          <button
            onClick={() => step === 0 ? router.back() : setStep((s) => s - 1)}
            className="text-xs text-neutral-500 font-medium tracking-wide hover:text-neutral-300 transition-colors"
          >
            ← back
          </button>
          <div className="flex items-center gap-2">
            {dots}
          </div>
          <div style={{ width: 45 }} /> {/* Balance space for flex-between */}
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col justify-center px-8 pb-12 items-center">
          <div className="relative z-10 w-full max-w-sm -mt-32">
            <h1 key={`title-${step}`} className="slide-in text-3xl font-bold leading-tight tracking-[-0.02em] mb-3">
              {currentStep.title}
            </h1>
            
            <p key={`desc-${step}`} className="slide-in text-sm text-neutral-400 mb-6 leading-relaxed">
              {currentStep.description}
            </p>

            {currentStep.id === "welcome" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 pointer-events-none z-0 overflow-visible">
                <AsciiMotionBulb />
              </div>
            )}

            {currentStep.id === "process" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 pointer-events-none z-0 overflow-visible">
                <AsciiMotionProcess />
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="px-8 pb-12 w-full flex justify-center">
          <button
            onClick={handleNext}
            className="w-full max-w-sm py-4 bg-white text-black rounded-2xl text-sm font-bold tracking-wide hover:scale-[0.98] active:scale-[0.95] transition-transform"
          >
            {isLastStep ? "let's get started!" : "continue →"}
          </button>
        </div>

      </main>
    </>
  );
}
