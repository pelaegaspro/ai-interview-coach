const { getModeLabel, MAX_RESUME_CHARS } = require("./constants");
const { normalizeWhitespace, truncateText } = require("./text");
const { ROLE_TEMPLATES } = require("../services/ai/templates/roleTemplates");
const { TYPE_TEMPLATES } = require("../services/ai/templates/typeTemplates");
const { DEPTH_TEMPLATES } = require("../services/ai/templates/depthTemplates");
const { resolveDepth } = require("../services/ai/utils/depthResolver");

function buildCoachSystemPrompt({ mode, experience = "Not specified", jobJd = "", resumeText, type }) {
    const depth = resolveDepth(experience);
  const cleanedResume = truncateText(normalizeWhitespace(resumeText || ""), MAX_RESUME_CHARS);
  const resumeContext = cleanedResume
    ? `\nCandidate Resume:\n${cleanedResume}`
    : "";

  return [
    "You are SilentAssist AI, an invisible desktop assistant providing real-time answers for live job interviews.",
    `Role: ${getModeLabel(mode)}`,
    `Experience: ${experience}`,
    `Job Description: ${jobJd || "General"}`,
    "",
    "DEPTH CONTEXT:",
    DEPTH_TEMPLATES[depth] || DEPTH_TEMPLATES.mid,
    "",
    "ROLE CONTEXT:",
    ROLE_TEMPLATES[mode] || ROLE_TEMPLATES.general || "",
    "",
    "QUESTION TYPE CONTEXT:",
    TYPE_TEMPLATES[type] || TYPE_TEMPLATES.general || "",
    "",
    resumeContext,
    "",
    "INSTRUCTIONS:",
    "- Answer concisely",
    "- Use bullet points",
    "- Include examples",
    "- Return STRICT JSON exactly matching this schema:",
    `{
  "shortAnswer": "Short draft in 1-2 lines",
  "bulletPoints": ["point 1", "point 2"],
  "starSuggestion": "STAR framework suggestion if behavioral, else empty string",
  "keywords": ["key1", "key2"],
  "followUpSuggestion": "Predicted next question",
  "coachingTips": ["tip 1"]
}`,
    resumeSection
  ].join("\n");
}

function buildCoachUserPrompt(transcript) {
  return [
    "Provide a concise draft answer and coaching suggestions for the following interview question.",
    "If you are not confident about the exact question, provide the best helpful interpretation.",
    "",
    "Interview Context:",
    transcript
  ].join("\n");
}

module.exports = {
  buildCoachSystemPrompt,
  buildCoachUserPrompt
};
