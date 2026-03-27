function TranscriptPanel({ segments, transcriptText, isListening, isTranscribing }) {
  return (
    <section className="glass-panel p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">Live Transcript</h2>
          <p className="mt-1 text-sm text-slate-300">
            Recent microphone chunks are appended here as they are transcribed.
          </p>
        </div>

        <div className="text-right text-xs text-slate-400">
          <p>{segments.length} segment(s)</p>
          <p>{isListening || isTranscribing ? "Updating live" : "Idle"}</p>
        </div>
      </div>

      <div className="mt-4 h-52 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/45 p-3">
        {segments.length ? (
          <div className="space-y-2">
            {segments.map((segment) => (
              <div
                key={segment.id}
                className="rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2 text-sm leading-6 text-slate-100"
              >
                {segment.text}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-center text-sm text-slate-400">
            {isListening
              ? "Listening for the first transcript chunk..."
              : "Start listening to capture interview audio and see live transcript here."}
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-slate-400">
        {transcriptText
          ? "Coaching context tracks the latest transcript window for fast responses."
          : "No transcript has been captured yet."}
      </div>
    </section>
  );
}

export default TranscriptPanel;
