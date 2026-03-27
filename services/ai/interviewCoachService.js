const sessionStore = require("../../backend/store/sessionStore");
const { getAIProvider, getSelectedProvider } = require("./providerFactory");
const { DEFAULT_MODE } = require("../../utils/constants");
const { cleanList, normalizeWhitespace } = require("../../utils/text");

async function generateCoaching({ transcript, mode = DEFAULT_MODE }) {
  const provider = getAIProvider();
  const resumeText = sessionStore.getResumeText();
  const result = await provider.generateCoaching({
    transcript,
    mode,
    resumeText
  });

  return {
    shortAnswer: normalizeWhitespace(result.shortAnswer),
    bulletPoints: cleanList(result.bulletPoints, 5),
    starSuggestion: normalizeWhitespace(result.starSuggestion),
    keywords: cleanList(result.keywords, 8),
    followUpSuggestion: normalizeWhitespace(result.followUpSuggestion),
    coachingTips: cleanList(result.coachingTips, 4),
    provider: getSelectedProvider(),
    generatedAt: new Date().toISOString()
  };
}

module.exports = {
  generateCoaching
};
