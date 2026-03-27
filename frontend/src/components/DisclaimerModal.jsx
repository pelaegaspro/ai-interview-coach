export default function DisclaimerModal({ onClose }) {
  const handleUpgrade = () => {
    window.open("https://silentassist.ai/upgrade", "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700/50 p-6 rounded-2xl max-w-sm text-sm shadow-2xl">
        <h2 className="text-lg font-bold mb-2 text-amber-400">⚠️ Important Notice</h2>

        <p className="mb-4 text-slate-300 leading-relaxed">
          This free version is for evaluation and practice purposes. 
          <br/><br/>
          It may experience latency or provide incomplete responses during high loads, and is <b>not recommended</b> for real, high-stakes live interviews.
        </p>
        
        <div className="mb-4 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-200 text-xs">
          🔥 Pro users get unlimited, priority answers powered by 3x faster and deeper AI context engines.
        </div>

        <div className="flex flex-col gap-2">
          <button onClick={onClose} className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-lg transition-colors">
            Start Free Practice
          </button>

          <button onClick={handleUpgrade} className="w-full py-2 border border-slate-600 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
            Upgrade Now 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
