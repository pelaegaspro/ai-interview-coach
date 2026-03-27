const { transcribeBuffer } = require("../../services/stt/transcriptionService");
const { AppError } = require("../../utils/errors");

async function handleTranscribe(req, res, next) {
  try {
    if (!req.file) {
      throw new AppError("Upload an audio file in the `audio` field.", 400);
    }

    const text = await transcribeBuffer({
      buffer: req.file.buffer,
      filename: req.file.originalname,
      mimetype: req.file.mimetype
    });

    res.json({
      text,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleTranscribe
};
