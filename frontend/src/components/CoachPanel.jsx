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

        <div className="text-right text-xs text-slate-400">
          <p>{isGenerating ? "Refreshing..." : "Up to date"}</p>
          <p>{provider ? `Provider: ${provider}` : ""}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <Section title="Short Answer">
          <p className="leading-6 text-slate-50">{coaching.shortAnswer}</p>
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
    </section>
  );
}

export default CoachPanel;
