import Header from "./components/Header";
import ControlPanel from "./components/ControlPanel";
import TranscriptPanel from "./components/TranscriptPanel";
import CoachPanel from "./components/CoachPanel";
import { useInterviewCoach } from "./hooks/useInterviewCoach";
import { useOverlayState } from "./hooks/useOverlayState";
import { INTERVIEW_MODES } from "./lib/modes";

function App() {
  const coach = useInterviewCoach();
  const overlay = useOverlayState();

  const activeModeLabel =
    INTERVIEW_MODES.find((item) => item.id === coach.mode)?.label || "General";

  return (
    <div className="min-h-screen bg-transparent p-3 text-slate-100">
      <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-mesh-dark shadow-glow">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%),linear-gradient(180deg,rgba(15,23,42,0.16),transparent_40%)]" />

        <Header
          modeLabel={activeModeLabel}
          isListening={coach.isListening}
          windowAction={overlay.windowAction}
          shortcuts={overlay.appConfig.shortcuts}
        />

        {coach.error ? (
          <div className="mx-4 mt-1 rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {coach.error}
          </div>
        ) : null}

        <main className="relative z-10 flex flex-col gap-4 p-4">
          <ControlPanel
            mode={coach.mode}
            setMode={coach.setMode}
            isListening={coach.isListening}
            isTranscribing={coach.isTranscribing}
            isGenerating={coach.isGenerating}
            isUploadingResume={coach.isUploadingResume}
            onStartListening={coach.startListening}
            onStopListening={coach.stopListening}
            onClearSession={coach.clearSession}
            onResumeUpload={coach.uploadResume}
            resumeStatus={coach.resumeStatus}
            opacity={overlay.overlay.opacity}
            overlayRange={overlay.appConfig.overlayRange}
            clickThrough={overlay.overlay.clickThrough}
            onOpacityChange={overlay.setOpacity}
            onClickThroughChange={overlay.setClickThrough}
            onToggleVisibility={overlay.toggleVisibility}
            shortcuts={overlay.appConfig.shortcuts}
            permissionStatus={coach.permissionStatus}
          />

          <TranscriptPanel
            segments={coach.transcriptSegments}
            transcriptText={coach.transcriptText}
            isListening={coach.isListening}
            isTranscribing={coach.isTranscribing}
          />

          <CoachPanel
            coaching={coach.coaching}
            isGenerating={coach.isGenerating}
            provider={coach.coaching?.provider}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
