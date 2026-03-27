import { INTERVIEW_MODES } from "../lib/modes";
import StatusPill from "./StatusPill";

function ControlPanel({
  mode,
  setMode,
  experience,
  setExperience,
  jobJd,
  setJobJd,
  aiModel,
  setAiModel,
  language,
  setLanguage,
  isListening,
  isTranscribing,
  isGenerating,
  isUploadingResume,
  onStartListening,
  onStopListening,
  onClearSession,
  onResumeUpload,
  resumeStatus,
  opacity,
  overlayRange,
  clickThrough,
  onOpacityChange,
  onClickThroughChange,
  onToggleVisibility,
  shortcuts,
  permissionStatus
}) {
  const micTone =
    permissionStatus === "denied" ? "rose" : permissionStatus === "prompt" ? "amber" : "slate";
  const minOpacity = Math.round((overlayRange?.min ?? 0.6) * 100);
  const maxOpacity = Math.round((overlayRange?.max ?? 0.95) * 100);

  return (
    <section className="glass-panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">Live Coaching Controls</h2>
          <p className="mt-1 text-sm text-slate-300">
            Audio is captured only while listening is enabled. Chunks are sent every 4 seconds.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusPill tone={isListening ? "rose" : "slate"}>
            {isListening ? "Listening" : "Stopped"}
          </StatusPill>
          <StatusPill tone={micTone}>Mic Permission: {permissionStatus}</StatusPill>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={isListening ? onStopListening : onStartListening}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              isListening
                ? "bg-rose-500 text-white hover:bg-rose-400"
                : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
            }`}
          >
            {isListening ? "Stop Listening" : "Start Listening"}
          </button>

          <button
            type="button"
            onClick={onClearSession}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-cyan-300/35 hover:bg-white/10"
          >
            Clear Session
          </button>
        </div>

        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Role Mode
          </label>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/35"
          >
            {INTERVIEW_MODES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <details className="group rounded-2xl border border-white/10 bg-slate-950/45 p-3 open:pb-4 transition-all">
          <summary className="cursor-pointer text-sm font-semibold text-white outline-none marker:text-cyan-400">
            Advanced Context & AI Settings
          </summary>
          <div className="mt-4 grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  AI Model
                </label>
                <select
                  value={aiModel}
                  onChange={(event) => setAiModel(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/35"
                >
                  <option value="gpt-5">GPT-5 (Recommended)</option>
                  <option value="gpt-4.1">GPT-4.1</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/35"
                >
                  <option value="auto">Auto-Detect (52+ Langs)</option>
                  <option value="en">English (en)</option>
                  <option value="es">Spanish (es)</option>
                  <option value="fr">French (fr)</option>
                  <option value="de">German (de)</option>
                  <option value="zh">Chinese (zh)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Experience Level
                </label>
                <input
                  type="text"
                  value={experience}
                  onChange={(event) => setExperience(event.target.value)}
                  placeholder="e.g. 5 Years"
                  className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/35"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Job Description
                </label>
                <input
                  type="text"
                  value={jobJd}
                  onChange={(event) => setJobJd(event.target.value)}
                  placeholder="Paste Job JD keywords..."
                  className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/35"
                />
              </div>
            </div>
          </div>
        </details>

        <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Resume Context</p>
              <p className="mt-1 text-sm text-slate-300">{resumeStatus.message}</p>
            </div>

            <label className="cursor-pointer rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100 transition hover:bg-cyan-400/15">
              {isUploadingResume ? "Uploading..." : "Upload PDF"}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                disabled={isUploadingResume}
                onChange={(event) => {
                  const [file] = Array.from(event.target.files || []);
                  if (file) {
                    onResumeUpload(file);
                  }
                  event.target.value = "";
                }}
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3">
          <div className="flex items-center justify-between text-sm text-slate-200">
            <span className="font-semibold">Overlay Opacity</span>
            <span>{Math.round(opacity * 100)}%</span>
          </div>

          <input
            type="range"
            min={minOpacity}
            max={maxOpacity}
            step="1"
            value={Math.round(opacity * 100)}
            onChange={(event) => onOpacityChange(Number(event.target.value) / 100)}
            className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onClickThroughChange(!clickThrough)}
            className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
              clickThrough
                ? "border-amber-300/35 bg-amber-400/10 text-amber-50 hover:bg-amber-400/15"
                : "border-white/10 bg-white/5 text-slate-100 hover:border-cyan-300/35 hover:bg-white/10"
            }`}
          >
            {clickThrough ? "Disable Click-Through" : "Enable Click-Through"}
          </button>

          <button
            type="button"
            onClick={onToggleVisibility}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-cyan-300/35 hover:bg-white/10"
          >
            Hide Overlay
          </button>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <StatusPill tone={isTranscribing ? "amber" : "slate"}>
            {isTranscribing ? "Transcribing..." : "Transcription Ready"}
          </StatusPill>
          <StatusPill tone={isGenerating ? "cyan" : "slate"}>
            {isGenerating ? "Generating Coaching..." : "Coach Standing By"}
          </StatusPill>
          <StatusPill tone="slate">{shortcuts.visibility} restore overlay</StatusPill>
        </div>
      </div>
    </section>
  );
}

export default ControlPanel;
