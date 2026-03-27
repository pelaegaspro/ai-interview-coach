import { useEffect, useState } from "react";

export default function SessionTimer({ startTime, plan = "free", onExpire }) {
  const limits = {
    free: 20,
    pro: 60,
    premium: 120
  };

  const limitSeconds = limits[plan] * 60;
  const [timeLeft, setTimeLeft] = useState(limitSeconds);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - new Date(startTime).getTime()) / 1000;
      const remaining = Math.max(0, limitSeconds - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, plan, limitSeconds, onExpire]);

  if (!startTime) return null;

  const min = Math.floor(timeLeft / 60);
  const sec = Math.floor(timeLeft % 60);
  const percent = ((limitSeconds - timeLeft) / limitSeconds) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest mb-1.5">
        <span className="text-slate-400 capitalize">{plan} Plan Limit</span>
        <span className={timeLeft < 300 ? "text-rose-400 animate-pulse" : "text-amber-400"}>
          ⏳ {min}:{sec.toString().padStart(2, "0")} LEFT
        </span>
      </div>

      <div className="bg-slate-800/50 h-1.5 rounded-full overflow-hidden border border-white/5">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            timeLeft < 300 ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" : "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {timeLeft < 300 && (
        <div className="text-[10px] text-rose-400 mt-1.5 flex gap-1 items-center">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping block" />
          Time running out! AI assistance pausing soon.
        </div>
      )}
    </div>
  );
}
