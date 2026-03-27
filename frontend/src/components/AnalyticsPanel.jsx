import { useEffect, useState } from "react";
import { getAppConfig } from "../lib/apiClient";

export default function AnalyticsPanel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const { backendUrl } = await getAppConfig();
        const res = await fetch(`${backendUrl}/analytics`);
        const json = await res.json();
        setData(json);
      } catch (err) { }
    }
    load();
  }, []);

  if (!data) return <div className="text-slate-400 text-xs text-center p-4">Loading analytics...</div>;

  let lowestType = "";
  if (data.typeBreakdown && Object.keys(data.typeBreakdown).length > 0) {
    lowestType = Object.entries(data.typeBreakdown)
       .sort((a,b)=>a[1]-b[1])[0][0];
  }

  return (
    <div className="glass-panel p-4 mt-4 text-xs text-slate-200">
      <h3 className="font-semibold text-white mb-2 uppercase tracking-widest text-slate-400">Insight Dashboard</h3>
      <div className="flex gap-4 mb-3">
        <div className="bg-slate-800/50 p-2 rounded flex-1">
          <div className="text-slate-400">Total</div>
          <div className="text-lg font-bold text-cyan-300">{data.totalQuestions}</div>
        </div>
        <div className="bg-slate-800/50 p-2 rounded flex-1">
          <div className="text-slate-400">Avg Score</div>
          <div className="text-lg font-bold text-amber-300">⭐ {data.averageScore}</div>
        </div>
      </div>

      <div>
        <b className="text-slate-300">Breakdown:</b>
        <div className="mt-1 grid grid-cols-2 gap-1">
          {Object.entries(data.typeBreakdown).map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-white/5 py-1">
              <span className="capitalize">{k.replace("_", " ")}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {lowestType && (
        <div className="mt-3 p-2 bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 rounded text-center">
          💡 You may need improvement in <b>{lowestType.replace("_", " ").toUpperCase()}</b> questions.
        </div>
      )}
    </div>
  );
}
