const sessionStore = require("./sessionStore");
const { getAIProvider, getSelectedProvider } = require("./providerFactory"); // Keep getSelectedProvider for now
const { DEFAULT_MODE } = require("../../utils/constants");
const { cleanList, normalizeWhitespace } = require("../../utils/text");
const { answerCache } = require("../../utils/cache");
const { classifyQuestion } = require("./utils/questionClassifier");
const { classifyWithLLM } = require("./utils/llmClassifier");
const { scoreAnswer } = require("./utils/answerScorer");

function extractQuestion(transcript) {
  const sentences = transcript.split(/[?.!]/).map((s) => s.trim()).filter(Boolean);
  return sentences[sentences.length - 1] || transcript;
}

async function generateCoaching({ transcript, mode = DEFAULT_MODE, experience, jobJd, model, onChunk, signal }) {
  const provider = getAIProvider();
  const question = extractQuestion(transcript);
  
  // Step 1: Heuristic classification
  let { type, confidence } = classifyQuestion(question);

  // Step 2: Fallback if low confidence
  if (confidence < 0.75) {
    try {
      const llmType = await classifyWithLLM(question);
      type = llmType;
      confidence = 0.9;
    } catch (err) {
      type = "general";
      confidence = 0.5;
    }
  }
  
  const cacheKey = `${mode}:${question.trim().toLowerCase()}`;
  if (answerCache.has(cacheKey)) {
    const cached = answerCache.get(cacheKey);
    if (onChunk) {
      onChunk(JSON.stringify(cached), JSON.stringify(cached));
    }
    return cached;
  }

  const resumeText = sessionStore.getResumeText();
  const result = await provider.generateCoaching({
    transcript: `Question: ${question}`,
    mode,
    experience,
    jobJd,
    model: model || "gpt-5",
    resumeText,
    type,
    onChunk,
    signal
  });

  let score = null;
  let feedback = "";
  try {
    const scoreTextContext = result.shortAnswer || (result.coachingTips && result.coachingTips[0]) || "";
    if (scoreTextContext) {
      const scoreData = await scoreAnswer(question, scoreTextContext);
      score = scoreData.score;
      feedback = scoreData.feedback;
    }
  } catch (err) {
    // Scoring fallback
  }

  const formattedResult = {
    shortAnswer: normalizeWhitespace(result.shortAnswer),
    bulletPoints: cleanList(result.bulletPoints, 5),
    starSuggestion: normalizeWhitespace(result.starSuggestion),
    keywords: cleanList(result.keywords, 8),
    followUpSuggestion: normalizeWhitespace(result.followUpSuggestion),
    coachingTips: cleanList(result.coachingTips, 4),
    provider: getSelectedProvider(),
    generatedAt: new Date().toISOString(),
    type,
    confidence,
    source: "LLM",
    score,
    feedback
  };

  if (answerCache.size > 100) {
    const firstKey = answerCache.keys().next().value;
    answerCache.delete(firstKey);
  }
  answerCache.set(cacheKey, formattedResult);

  return formattedResult;
}

module.exports = {
  generateCoaching
};
