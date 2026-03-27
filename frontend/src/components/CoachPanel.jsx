function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3">
      <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{title}</h3>
      <div className="mt-2 text-sm text-slate-100">{children}</div>
    </div>
  );
}

function CoachPanel({ coaching, isGenerating, provider }) {
  if (!coaching) {
    return (
      <section className="glass-panel p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">Coaching Output</h2>
            <p className="mt-1 text-sm text-slate-300">
              Short answer drafts, talking points, keywords, and coaching tips appear here.
            </p>
          </div>
          <div className="text-xs text-slate-400">{isGenerating ? "Generating..." : "Waiting"}</div>
        </div>

        <div className="mt-4 rounded-3xl border border-dashed border-white/10 bg-slate-950/35 px-6 py-10 text-center text-sm text-slate-400">
          Start a live session and speak into the mic to generate coaching suggestions.
        </div>
      </section>
    );
  }

  return (
    <section className="glass-panel p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">Coaching Output</h2>
          <p className="mt-1 text-sm text-slate-300">
            Optimized for glanceable interview support in a floating overlay.
          </p>
        </div>

        <div className="text-right flex flex-col items-end gap-1">
          <div className="text-xs text-slate-400">
            <p>{isGenerating ? "Refreshing..." : "Up to date"}</p>
            <p>{provider ? `Provider: ${provider}` : ""}</p>
          </div>
          {coaching.type && coaching.confidence && (
            <div 
              className="mt-1 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border"
              style={{
                color: coaching.confidence > 0.85 ? "#4ade80" : coaching.confidence > 0.7 ? "#facc15" : "#f87171",
                borderColor: coaching.confidence > 0.85 ? "#4ade8055" : coaching.confidence > 0.7 ? "#facc1555" : "#f8717155",
                backgroundColor: coaching.confidence > 0.85 ? "#4ade8011" : coaching.confidence > 0.7 ? "#facc1511" : "#f8717111"
              }}
            >
              🧠 {coaching.type.replace('_', ' ')} • {(coaching.confidence * 100).toFixed(0)}% CONFIDENCE
            </div>
          )}
        </div>
      </div>

      <div style={{ maxHeight: "340px", overflowY: "auto", paddingRight: "4px" }}>
        <div className="mt-4 grid gap-3">
          <Section title="Short Answer">
            <p className="leading-6 text-slate-50">{coaching.shortAnswer}</p>
            {coaching.score && (
              <div className="mt-3 border-t border-white/5 pt-3 flex items-center gap-3">
                <div 
                  className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border"
                  style={{
                    color: coaching.score > 85 ? "#4ade80" : coaching.score > 70 ? "#facc15" : "#f87171",
                    borderColor: coaching.score > 85 ? "#4ade8055" : coaching.score > 70 ? "#facc1555" : "#f8717155",
                    backgroundColor: coaching.score > 85 ? "#4ade8011" : coaching.score > 70 ? "#facc1511" : "#f8717111"
                  }}
                >
                  ⭐ SCORE: {coaching.score}/100
                </div>
                <div className="text-[11px] italic text-slate-400">
                  {coaching.feedback}
                </div>
              </div>
            )}
            {coaching.source !== "MEMORY" && coaching.score && coaching.score < 90 && (
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('triggerImproveAnswer'))}
                className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-indigo-500/20 border border-indigo-500/50 px-3 py-1.5 text-xs font-medium text-indigo-200 transition-colors hover:bg-indigo-500/30"
              >
                 ✨ Improve Answer
              </button>
            )}
          </Section>

          <Section title="Bullet Points">
            <ul className="space-y-2">
              {coaching.bulletPoints.map((point) => (
                <li key={point} className="flex gap-2 leading-6 text-slate-100">
                  <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Section>

          {coaching.starSuggestion ? (
            <Section title="STAR Suggestion">
              <p className="leading-6 text-slate-100">{coaching.starSuggestion}</p>
            </Section>
          ) : null}

          <Section title="Keywords">
            <div className="flex flex-wrap gap-2">
              {coaching.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-cyan-50"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </Section>

          <Section title="Follow-Up Suggestion">
            <p className="leading-6 text-slate-100">{coaching.followUpSuggestion}</p>
          </Section>

          <Section title="Coaching Tips">
            <ul className="space-y-2">
              {coaching.coachingTips.map((tip) => (
                <li key={tip} className="flex gap-2 leading-6 text-slate-100">
                  <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-amber-300" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>
    </section>
  );
}

export default CoachPanel;
