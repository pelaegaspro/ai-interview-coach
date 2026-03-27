const DEFAULT_BACKEND_PORT = Number(process.env.PORT || 8787);
const DEFAULT_MODE = "behavioral";
const DEFAULT_OVERLAY_OPACITY = 0.85;
const OVERLAY_SHORTCUT_ACCELERATOR = "CommandOrControl+Shift+A";
const CLICK_THROUGH_SHORTCUT_ACCELERATOR = "CommandOrControl+Shift+M";
const OVERLAY_SHORTCUT_LABEL = process.platform === "darwin" ? "Cmd+Shift+A" : "Ctrl+Shift+A";
const CLICK_THROUGH_SHORTCUT_LABEL =
  process.platform === "darwin" ? "Cmd+Shift+M" : "Ctrl+Shift+M";
const AUDIO_CHUNK_MS = 4000;
const MAX_RESUME_CHARS = 8000;

const INTERVIEW_MODES = [
  {
    id: "data-analyst",
    label: "Data Analyst",
    prompt:
      "Focus on metrics, business impact, experimentation, SQL fluency, dashboarding, data storytelling, and stakeholder communication."
  },
  {
    id: "behavioral",
    label: "Behavioral (HR)",
    prompt:
      "Treat the transcript as a behavioral prompt. Use a STAR-friendly structure, emphasize ownership, conflict resolution, leadership, learning, and measurable impact."
  },
  {
    id: "sql-python",
    label: "SQL / Python Technical",
    prompt:
      "Prioritize technical accuracy, structured problem solving, SQL reasoning, Python implementation details, edge cases, debugging, and clarity under pressure."
  }
];

function isSupportedMode(mode) {
  return INTERVIEW_MODES.some((item) => item.id === mode);
}

function getModePrompt(mode) {
  return INTERVIEW_MODES.find((item) => item.id === mode)?.prompt || INTERVIEW_MODES[1].prompt;
}

module.exports = {
  DEFAULT_BACKEND_PORT,
  DEFAULT_MODE,
  DEFAULT_OVERLAY_OPACITY,
  OVERLAY_SHORTCUT_ACCELERATOR,
  CLICK_THROUGH_SHORTCUT_ACCELERATOR,
  OVERLAY_SHORTCUT_LABEL,
  CLICK_THROUGH_SHORTCUT_LABEL,
  AUDIO_CHUNK_MS,
  MAX_RESUME_CHARS,
  INTERVIEW_MODES,
  isSupportedMode,
  getModePrompt
};
