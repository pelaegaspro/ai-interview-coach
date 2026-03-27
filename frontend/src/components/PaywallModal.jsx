export default function PaywallModal({ onClose, onUpgrade }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <div className="bg-slate-900 border border-slate-700/50 p-6 rounded-2xl max-w-md text-sm shadow-[0_0_50px_rgba(79,70,229,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
        
        <h2 className="text-xl font-bold mb-2 text-white flex items-center gap-2">
          🚀 Unlock Full AI Power
        </h2>

        <p className="mb-4 text-slate-300">
          The Free plan has limited performance bounds. Upgrade for blazing fast, smarter, and unlimited real-time answers.
        </p>

        <ul className="mb-6 space-y-2 text-xs font-medium text-slate-200 bg-slate-800/50 p-4 rounded-xl border border-white/5">
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">✔</span> Unlimited real-time answers
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">✔</span> Up to 3x faster response streaming
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">✔</span> Higher accuracy & advanced contextual caching
          </li>
        </ul>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => onUpgrade("pro")}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg"
          >
            Upgrade to Pro — ₹499
          </button>

          <button
            onClick={() => onUpgrade("premium")}
            className="w-full border border-slate-600 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Go Premium — ₹799
          </button>

          <button onClick={onClose} className="text-xs mt-2 text-slate-500 hover:text-slate-300 underline underline-offset-4 text-center">
            Continue on Free Plan
          </button>
        </div>
      </div>
    </div>
  );
}
