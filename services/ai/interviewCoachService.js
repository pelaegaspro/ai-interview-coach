const sessionStore = require("./sessionStore");
const { getAIProvider, getSelectedProvider } = require("./providerFactory"); // Keep getSelectedProvider for now
const { DEFAULT_MODE } = require("../../utils/constants");
const { cleanList, normalizeWhitespace } = require("../../utils/text");
const { answerCache } = require("../../utils/cache");
const { classifyQuestion } = require("./utils/questionClassifier");
const { classifyWithLLM } = require("./utils/llmClassifier");
const { scoreAnswer } = require("./utils/answerScorer");
const { improveAnswer } = require("./utils/answerImprover");
const { loadMemory, saveMemory, findSimilar } = require("./utils/memoryStore");
const { loadAnalytics, saveAnalytics } = require("../../store/analyticsStore");

let memoryStore = loadMemory();

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

  const smartCached = findSimilar(memoryStore, mode, question);
  if (smartCached && smartCached.score >= 75) {
    if (onChunk) {
      onChunk(JSON.stringify(smartCached), JSON.stringify(smartCached));
    }
    return smartCached;
  }

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

      if (score !== null && score < 70 && question.length >= 10) {
        improveAnswer(question, JSON.stringify(result)).then((improved) => {
          if (improved && improved.shortAnswer) {
             const learnedAnswer = { ...formattedResult, ...improved, score: Math.max(90, score + 20), feedback: "Auto-improved from historical cache", type, source: "MEMORY" };
             memoryStore[cacheKey] = learnedAnswer;
             saveMemory(memoryStore);
          }
        }).catch(() => {});
      } else if (score !== null && score >= 75 && question.length >= 10) {
        memoryStore[cacheKey] = { ...formattedResult, score, feedback, source: "MEMORY" };
        saveMemory(memoryStore);
      }
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

  try {
    const analytics = loadAnalytics();
    analytics.push({
      question,
      type,
      score,
      timestamp: Date.now()
    });
    saveAnalytics(analytics);
  } catch (e) {}

  return formattedResult;
}

async function improveAnswerDirect(mode, question, previousAnswer) {
  const cacheKey = `${mode}:${question.trim().toLowerCase()}`;
  const { improveAnswer } = require("./utils/answerImprover");
  const improved = await improveAnswer(question, JSON.stringify(previousAnswer));
  
  if (improved && improved.shortAnswer) {
    const finalObj = { ...previousAnswer, ...improved, score: 95, feedback: "Manually improved from feedback.", source: "MEMORY" };
    memoryStore[cacheKey] = finalObj;
    saveMemory(memoryStore);
    return finalObj;
  }
  return previousAnswer;
}

module.exports = {
  generateCoaching,
  improveAnswerDirect
};
