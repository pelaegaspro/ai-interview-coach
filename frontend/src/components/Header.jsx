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
          <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-200/75">AI Coach</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
            AI Interview Coach
          </h1>
          <p className="mt-1 max-w-xs text-sm text-slate-300">
            Live transcript, fast draft answers, and coaching cues in a visible overlay.
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
