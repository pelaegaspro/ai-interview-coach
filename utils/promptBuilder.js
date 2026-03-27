const { getModePrompt, MAX_RESUME_CHARS } = require("./constants");
const { normalizeWhitespace, truncateText } = require("./text");

function buildCoachSystemPrompt({ mode, resumeText }) {
  const cleanedResume = truncateText(normalizeWhitespace(resumeText || ""), MAX_RESUME_CHARS);
  const resumeSection = cleanedResume
    ? `Candidate resume context:\n${cleanedResume}`
    : "Candidate resume context:\nNo resume has been uploaded yet. Do not invent any resume facts.";

  return [
    "You are AI Interview Coach, a fast overlay assistant for live job interviews.",
    "Your answers must be glanceable, concise, and practical for a candidate under time pressure.",
    "Never fabricate resume details, achievements, employers, metrics, or certifications.",
    "If the transcript is noisy or incomplete, infer cautiously and keep coaching grounded.",
    "Short answer must be at most two short lines.",
    "Bullet points must be crisp and specific.",
    "Use STAR guidance when the situation is behavioral; otherwise keep starSuggestion brief or empty.",
    "Keywords must be short phrases, not sentences.",
    "Coaching tips should help delivery, structure, and emphasis.",
    `Mode guidance: ${getModePrompt(mode)}`,
    resumeSection
  ].join("\n\n");
}

function buildCoachUserPrompt(question) {
  return [
    "Use the live transcript below as the latest interview context.",
    "Provide a concise draft answer plus coaching suggestions.",
    "If you are not confident about the exact question, still provide the best helpful interpretation.",
    "",
    "Live transcript:",
    question
  ].join("\n");
}

module.exports = {
  buildCoachSystemPrompt,
  buildCoachUserPrompt
};
