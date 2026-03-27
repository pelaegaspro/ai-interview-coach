const tones = {
  cyan: "border-cyan-300/25 bg-cyan-400/10 text-cyan-100",
  rose: "border-rose-300/25 bg-rose-400/10 text-rose-100",
  amber: "border-amber-300/25 bg-amber-400/10 text-amber-100",
  slate: "border-white/10 bg-white/5 text-slate-200"
};

function StatusPill({ children, tone = "slate" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export default StatusPill;
