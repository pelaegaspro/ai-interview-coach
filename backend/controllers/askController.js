const { generateCoaching } = require("../../services/ai/interviewCoachService");
const { AppError } = require("../../utils/errors");
const { isSupportedMode } = require("../../utils/constants");

async function handleAsk(req, res, next) {
  try {
    const transcript =
      typeof req.body.transcript === "string"
        ? req.body.transcript.trim()
        : typeof req.body.question === "string"
          ? req.body.question.trim()
          : "";
    const mode = typeof req.body.mode === "string" ? req.body.mode.trim() : "";

    if (!transcript) {
      throw new AppError("The `transcript` field is required.", 400);
    }

    if (!isSupportedMode(mode)) {
      throw new AppError("The selected interview mode is not supported.", 400);
    }

    const result = await generateCoaching({ transcript, mode });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleAsk
};
