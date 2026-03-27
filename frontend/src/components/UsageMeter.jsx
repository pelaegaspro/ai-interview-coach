export default function UsageMeter({ usage = 0, limit = 20 }) {
  const percent = Math.min((usage / limit) * 100, 100);

  return (
    <div className="p-3 text-xs bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl max-w-[200px] shadow-lg">
      <div className="flex justify-between font-bold text-slate-300 mb-2 uppercase tracking-widest text-[10px]">
        <span>Free Plan Usage</span>
        <span>{usage} / {limit}</span>
      </div>

      <div className="bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${percent > 80 ? 'bg-rose-500' : 'bg-indigo-500'}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {percent > 80 && (
        <div className="text-rose-400 text-[10px] font-medium mt-2 flex items-center gap-1">
          <span className="animate-pulse">⚠</span>
          Almost out of free credits
        </div>
      )}
    </div>
  );
}
