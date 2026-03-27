import Header from "./components/Header";
import ControlPanel from "./components/ControlPanel";
import TranscriptPanel from "./components/TranscriptPanel";
import CoachPanel from "./components/CoachPanel";
import AnalyticsPanel from "./components/AnalyticsPanel";
import MockInterviewPanel from "./components/MockInterviewPanel";
import SessionTimer from "./components/SessionTimer";
import UsageMeter from "./components/UsageMeter";
import DisclaimerModal from "./components/DisclaimerModal";
import MockMode from "./components/MockMode";
import { useState, useEffect } from "react";
import { useInterviewCoach } from "./hooks/useInterviewCoach";
import { useOverlayState } from "./hooks/useOverlayState";
import { INTERVIEW_MODES } from "./lib/modes";

function App() {
  const coach = useInterviewCoach();
  const overlay = useOverlayState();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [trialStartTime, setTrialStartTime] = useState(null);
  const [usage, setUsage] = useState(5);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    if (coach.isListening && !trialStartTime) {
      setTrialStartTime(new Date().toISOString());
      setUsage(prev => prev + 1);
    }
  }, [coach.isListening, trialStartTime]);

  useEffect(() => {
    const triggerPaywall = () => setShowPaywall(true);
    const triggerDemo = () => setIsDemoMode(true);
    window.addEventListener('triggerDemo', triggerDemo);
    window.addEventListener('triggerPaywall', triggerPaywall);
    return () => {
      window.removeEventListener('triggerPaywall', triggerPaywall);
      window.removeEventListener('triggerDemo', triggerDemo);
    };
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("seenDisclaimer")) {
      setShowDisclaimer(true);
    }
  }, []);

  const closeDisclaimer = () => {
    localStorage.setItem("seenDisclaimer", "true");
    setShowDisclaimer(false);
  };

  const activeModeLabel =
    INTERVIEW_MODES.find((item) => item.id === coach.mode)?.label || "General";

  return (
    <div className="min-h-screen bg-transparent p-3 text-slate-100">
      <div
        style={{ background: "var(--overlay-bg, rgba(10,15,30,0.72))" }}
        className="relative overflow-hidden rounded-[30px] border border-white/10 shadow-glow"
      >
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
          {isDemoMode ? (
            <MockMode onExitDemo={() => setIsDemoMode(false)} />
          ) : (
            <>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-4">
              W AI
              {trialStartTime && <div className="w-48 ml-4"><SessionTimer startTime={trialStartTime} plan="free" onExpire={() => window.dispatchEvent(new CustomEvent('triggerPaywall'))} /></div>}
            </h1>
            <div className="absolute top-4 right-4 z-50">
              <UsageMeter usage={usage} limit={20} />
            </div>
          </div>
          <ControlPanel
            mode={coach.mode}
            setMode={coach.setMode}
            experience={coach.experience}
            setExperience={coach.setExperience}
            jobJd={coach.jobJd}
            setJobJd={coach.setJobJd}
            aiModel={coach.aiModel}
            setAiModel={coach.setAiModel}
            language={coach.language}
            setLanguage={coach.setLanguage}
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

          <MockInterviewPanel 
             question={coach.coaching ? coach.coaching.question : ""}
             transcript={coach.transcriptText}
             answer={coach.coaching}
          />

          <AnalyticsPanel />
            </>
          )}
        </main>
      </div>

      {showDisclaimer && <DisclaimerModal onClose={closeDisclaimer} />}
    </div>
  );
}

export default App;
