export default function PricingPage({ onUpgrade, onBack }) {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 md:p-12 relative">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
        >
          ← Back to App
        </button>

        <div className="text-center mb-12 mt-8">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Crack Interviews Faster.</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Upgrade to Pro and get unlimited real-time answers powered by advanced intelligence pipelines.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-sm">
          {/* FREE */}
          <div className="border border-slate-800 bg-slate-900/50 p-6 rounded-2xl flex flex-col">
            <h3 className="font-bold text-xl text-white">Free</h3>
            <p className="text-3xl font-extrabold text-white mt-4 mb-2">₹0</p>
            <p className="text-slate-500 text-xs mb-6">Start exploring for free</p>

            <ul className="text-sm space-y-3 mb-8 text-slate-300 flex-1">
              <li className="flex gap-2"><span>✔</span> 10–20 answers/day</li>
              <li className="flex gap-2"><span>✔</span> Basic heuristic AI</li>
              <li className="flex gap-2 opacity-50"><span>✖</span> No analytics insights</li>
              <li className="flex gap-2 opacity-50"><span>✖</span> No persistent memory</li>
            </ul>

            <button disabled className="border border-slate-700 bg-slate-800/50 text-slate-400 w-full py-3 rounded-xl font-medium cursor-not-allowed">
              Current Plan
            </button>
          </div>

          {/* PRO */}
          <div className="border-2 border-indigo-500 bg-slate-900 p-6 rounded-2xl flex flex-col relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(99,102,241,0.15)]">
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              ⭐ Most Popular
            </div>
            <h3 className="font-bold text-xl text-white">Pro</h3>
            <p className="text-3xl font-extrabold text-white mt-4 mb-2">₹499<span className="text-sm font-normal text-slate-500">/mo</span></p>
            <p className="text-emerald-400 text-xs mb-6 font-medium">🔥 Save 20% with yearly (₹399/mo)</p>

            <ul className="text-sm space-y-3 mb-8 text-slate-100 flex-1 relative z-10">
              <li className="flex gap-2"><span>✔</span> Unlimited answers</li>
              <li className="flex gap-2"><span>✔</span> Fast streaming AI</li>
              <li className="flex gap-2"><span>✔</span> Adaptive role depth</li>
              <li className="flex gap-2"><span>✔</span> Basic scoring memory</li>
            </ul>

            <button
              onClick={() => onUpgrade("pro")}
              className="bg-indigo-500 hover:bg-indigo-400 text-white w-full py-3 rounded-xl font-bold shadow-lg transition-colors"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* PREMIUM */}
          <div className="border border-slate-800 bg-slate-900/50 p-6 rounded-2xl flex flex-col relative">
            <h3 className="font-bold text-xl text-white flex gap-2 items-center">
              Premium 🚀
            </h3>
            <p className="text-3xl font-extrabold text-white mt-4 mb-2">₹799<span className="text-sm font-normal text-slate-500">/mo</span></p>
            <p className="text-emerald-400 text-xs mb-6 font-medium">🔥 Save 20% with yearly (₹649/mo)</p>

            <ul className="text-sm space-y-3 mb-8 text-slate-300 flex-1">
              <li className="flex gap-2 text-white"><span>✔</span> Everything in Pro</li>
              <li className="flex gap-2"><span>✔</span> Advanced analytics dashboard</li>
              <li className="flex gap-2"><span>✔</span> Self-improving answer maps</li>
              <li className="flex gap-2"><span>✔</span> Priority AI (faster + deeper)</li>
            </ul>

            <button
              onClick={() => onUpgrade("premium")}
              className="bg-white text-slate-900 hover:bg-slate-200 w-full py-3 rounded-xl font-bold transition-colors"
            >
              Go Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
