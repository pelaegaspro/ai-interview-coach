export default function MockInterviewPanel({ question, transcript, answer }) {
  if (!question && !transcript && !answer) {
    return null;
  }

  return (
    <div className="glass-panel p-5 space-y-4 text-sm mt-4">
       <h3 className="font-semibold text-white mb-2 uppercase tracking-widest text-slate-400">Mock Interview Visualizer</h3>
      {/* Interviewer Question */}
      {question && (
        <div className="bg-slate-900/50 border border-indigo-500/20 p-4 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.05)]">
          <div className="flex gap-2 items-center text-indigo-400 font-bold mb-2 uppercase tracking-widest text-[10px]">
             🎤 AI Interviewer
          </div>
          <div className="text-slate-200 leading-relaxed font-medium">{question}</div>
        </div>
      )}

      {/* Your Response */}
      {transcript && (
        <div className="bg-slate-800/50 border border-white/10 p-4 rounded-xl ml-4">
          <div className="flex gap-2 items-center text-slate-400 font-bold mb-2 uppercase tracking-widest text-[10px]">
             🗣 You
          </div>
          <div className="text-slate-300 leading-relaxed">{transcript}</div>
        </div>
      )}

      {/* AI Coach */}
      {answer && answer.shortAnswer && (
        <div className="bg-emerald-950/30 border border-emerald-500/20 p-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.05)]">
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-2 items-center text-emerald-400 font-bold uppercase tracking-widest text-[10px]">
              🤖 Live Output Suggestion
            </div>
            {answer.score && (
              <span className="text-[10px] font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-300/30">
                ⭐ SCORE: {answer.score}/100
              </span>
            )}
          </div>
          <div className="text-emerald-50 leading-relaxed">{answer.shortAnswer}</div>
          
          {answer.feedback && (
            <div className="mt-3 text-[11px] italic text-emerald-400/70 border-t border-emerald-500/10 pt-2">
              Feedback: {answer.feedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
