const { generateCoaching, improveAnswerDirect } = require("../../services/ai/interviewCoachService");
const { AppError } = require("../../utils/errors");
const { isSupportedMode } = require("../../utils/constants");

const MAX_TRANSCRIPT_CHARS = 4000;

async function handleAsk(req, res, next) {
  try {
    let transcript =
      typeof req.body.transcript === "string"
        ? req.body.transcript.trim()
        : typeof req.body.question === "string"
          ? req.body.question.trim()
          : "";
    const mode = typeof req.body.mode === "string" ? req.body.mode.trim() : "";
    const experience = typeof req.body.experience === "string" ? req.body.experience.trim() : "";
    const jobJd = typeof req.body.jobJd === "string" ? req.body.jobJd.trim() : "";
    const model = typeof req.body.model === "string" ? req.body.model.trim() : "";

    if (!transcript) {
      throw new AppError("The `transcript` field is required.", 400);
    }

    if (transcript.length > MAX_TRANSCRIPT_CHARS) {
      transcript = transcript.slice(-MAX_TRANSCRIPT_CHARS);
    }

    if (!isSupportedMode(mode)) {
      throw new AppError("The selected interview mode is not supported.", 400);
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const abortController = new AbortController();
    
    req.on("close", () => {
      abortController.abort();
    });

    const onChunk = (delta, fullText) => {
      res.write(`data: ${JSON.stringify({ delta })}\n\n`);
    };

    const result = await generateCoaching({ 
      transcript, mode, experience, jobJd, model, onChunk, signal: abortController.signal
    });
    res.write(`data: ${JSON.stringify({ done: true, final: result })}\n\n`);
    res.end();
  } catch (error) {
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    } else {
      next(error);
    }
  }
}

async function handleImprove(req, res, next) {
  try {
    const { mode, question, previousAnswer } = req.body;
    if (!mode || !question || !previousAnswer) {
      throw new AppError("Missing Required Parameters", 400);
    }
    const improved = await improveAnswerDirect(mode, question, previousAnswer);
    res.json(improved);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleAsk,
  handleImprove
};
