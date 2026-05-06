"use client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
const router = useRouter();

return (
    <>
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        .fs-root { font-family: 'Space Grotesk', sans-serif; }
        .blink { animation: blink 2.5s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.15} }
        .btn-primary {
        transition: opacity 0.15s ease, transform 0.1s ease;
        }
        .btn-primary:active { transform: scale(0.97); opacity: 0.85; }
        .btn-skip {
        transition: color 0.15s ease;
        }
        .btn-skip:hover { color: #999; }
    `}</style>

    {/* Inalis ang dot-grid at pinalitan ang background ng puti */}
    <main className="fs-root w-full h-screen bg-[#FFFFFF] flex flex-col overflow-hidden">

        {/* Top pill */}
        <div className="flex justify-center pt-12">
        <div className="flex items-center gap-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-full px-4 py-1.5 shadow-sm">
            <span className="blink block w-1.5 h-1.5 rounded-full bg-[#111]" />
            <span className="text-[10px] font-semibold text-[#888] uppercase tracking-[.2em]">
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
            <p className="text-[9px] font-semibold tracking-[.28em] text-[#888] uppercase mb-1">
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
            onClick={() => router.push("/settings")}
            className="btn-primary w-full py-3.5 bg-[#111] text-white rounded-2xl text-sm font-semibold tracking-wide"
            >
            Get Started
            </button>
            <button
            onClick={() => router.push("/capture")}
            className="btn-skip text-xs text-[#888] font-medium tracking-wide"
            >
            already set up? skip
            </button>
        </div>

        </div>
    </main>
    </>
);
}
