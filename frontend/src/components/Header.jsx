import StatusPill from "./StatusPill";

function WindowButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="no-drag inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
      aria-label={label}
    >
      {label}
    </button>
  );
}

function Header({ modeLabel, isListening, windowAction, shortcuts }) {
  return (
    <header className="drag-region relative z-10 border-b border-white/10 px-4 pb-4 pt-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-200/75">W AI</p>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              W AI
            </h1>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('triggerPricing'))}
              className="no-drag cursor-pointer rounded-full border border-amber-300/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-200 hover:bg-amber-400/20 transition-colors"
            >
              Upgrade to Pro
            </button>
          </div>
          <p className="mt-1 max-w-sm text-sm text-slate-300">
            Real-Time AI Answers · Undetectable on Screen · 52+ Languages
          </p>
        </div>

        <div className="flex items-center gap-2">
          <WindowButton label="-" onClick={() => windowAction("minimize")} />
          <WindowButton label="x" onClick={() => windowAction("close")} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <StatusPill tone="cyan">{modeLabel}</StatusPill>
        <StatusPill tone={isListening ? "rose" : "slate"}>
          {isListening ? "Mic Live" : "Mic Idle"}
        </StatusPill>
        <StatusPill tone="slate">{shortcuts.visibility} show/hide</StatusPill>
        <StatusPill tone="slate">{shortcuts.clickThrough} click-through</StatusPill>
      </div>
    </header>
  );
}

export default Header;
