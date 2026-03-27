const DEFAULT_BACKEND_PORT = Number(process.env.PORT || 8787);
const DEFAULT_MODE = "behavioral";
const DEFAULT_OVERLAY_OPACITY = 0.85;
const MIN_OVERLAY_OPACITY = 0.6;
const MAX_OVERLAY_OPACITY = 0.95;
const OVERLAY_SHORTCUT_ACCELERATOR = "CommandOrControl+Shift+A";
const CLICK_THROUGH_SHORTCUT_ACCELERATOR = "CommandOrControl+Shift+M";
const OVERLAY_SHORTCUT_LABEL = process.platform === "darwin" ? "Cmd+Shift+A" : "Ctrl+Shift+A";
const CLICK_THROUGH_SHORTCUT_LABEL =
  process.platform === "darwin" ? "Cmd+Shift+M" : "Ctrl+Shift+M";
const AUDIO_CHUNK_MS = 2000;
const MAX_RESUME_CHARS = 8000;

const INTERVIEW_MODES = [
  { id: "software-engineer", label: "Software Engineer", prompt: "Focus on coding, system design, DSA, and technical problem solving." },
  { id: "data-scientist", label: "Data Scientist & Analyst", prompt: "Focus on statistical concepts, ML explanations, SQL, and data storytelling." },
  { id: "product-manager", label: "Product Manager", prompt: "Focus on frameworks, estimation, strategic thinking, and user empathy." },
  { id: "hr-recruiter", label: "HR & Recruiter", prompt: "Focus on policy knowledge, compliance, and situational responses." },
  { id: "management-consultant", label: "Management Consultant", prompt: "Focus on case study frameworks, market sizing, and structured problem-solving." },
  { id: "business-executive", label: "Business Executive", prompt: "Focus on board-level talking points, financial metrics, and strategic narratives." },
  { id: "sales-professional", label: "Sales Professional", prompt: "Focus on objection handling, product positioning, and competitive intelligence." }
];

function isSupportedMode(mode) {
  return INTERVIEW_MODES.some((item) => item.id === mode);
}

function getModePrompt(mode) {
  return INTERVIEW_MODES.find((item) => item.id === mode)?.prompt || INTERVIEW_MODES[0].prompt;
}

function getModeLabel(mode) {
  return INTERVIEW_MODES.find((item) => item.id === mode)?.label || "General Professional";
}

module.exports = {
  DEFAULT_BACKEND_PORT,
  DEFAULT_MODE: "software-engineer",
  DEFAULT_OVERLAY_OPACITY,
  MIN_OVERLAY_OPACITY,
  MAX_OVERLAY_OPACITY,
  OVERLAY_SHORTCUT_ACCELERATOR,
  CLICK_THROUGH_SHORTCUT_ACCELERATOR,
  OVERLAY_SHORTCUT_LABEL,
  CLICK_THROUGH_SHORTCUT_LABEL,
  AUDIO_CHUNK_MS,
  MAX_RESUME_CHARS,
  INTERVIEW_MODES,
  isSupportedMode,
  getModePrompt,
  getModeLabel
};
