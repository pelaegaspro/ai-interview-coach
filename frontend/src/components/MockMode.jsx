import { useState } from "react";
import { MOCK_FLOW } from "../lib/mockData";

export default function MockMode({ onExitDemo }) {
  const [step, setStep] = useState(0);

  const current = MOCK_FLOW[step];

  function next() {
    if (step < MOCK_FLOW.length - 1) {
      setStep(step + 1);
    } else {
      onExitDemo();
    }
  }

  return (
    <div className="glass-panel p-6 mt-4 text-sm space-y-4">
      <div className="flex justify-between items-center border-b border-indigo-500/20 pb-3">
        <h3 className="font-bold text-indigo-400 uppercase tracking-widest text-[11px] flex items-center gap-2">
           <span className="relative flex h-2 w-2">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
           </span>
           Interactive Demo Mode
        </h3>
        <span className="text-[10px] text-slate-500 font-medium bg-slate-800 px-2 py-0.5 rounded-full">
           Step {step + 1} of {MOCK_FLOW.length}
        </span>
      </div>

      <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-xl">
        <div className="flex gap-2 items-center text-slate-400 font-bold mb-2 uppercase tracking-widest text-[10px]">
           🎤 Fake Interviewer
        </div>
        <div className="text-white text-base font-medium">{current.question}</div>
      </div>

      <div className="bg-indigo-950/30 border border-indigo-500/20 p-4 rounded-xl ml-4">
        <div className="flex gap-2 items-center text-indigo-400/80 font-bold mb-2 uppercase tracking-widest text-[10px]">
           🗣 Simulated Speech Transcript
        </div>
        <div className="text-indigo-100">{current.transcript}</div>
      </div>

      <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.05)]">
        <div className="flex gap-2 items-center text-emerald-400 font-bold mb-2 uppercase tracking-widest text-[10px]">
           🤖 Instant AI Suggestion
        </div>
        <div className="text-emerald-50 text-base">{current.answer.shortAnswer}</div>
      </div>

      <div className="pt-4 flex justify-between items-center">
        <button onClick={onExitDemo} className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-4">
          Exit Demo
        </button>
        <button 
          onClick={next} 
          className="bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg transition-colors"
        >
          {step < MOCK_FLOW.length - 1 ? "Simulate Next Question →" : "Start Real Interview 🚀"}
        </button>
      </div>
    </div>
  );
}
