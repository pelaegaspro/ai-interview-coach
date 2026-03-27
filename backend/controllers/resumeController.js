const { parseResumeBuffer } = require("../../services/resume/resumeService");
const sessionStore = require("../store/sessionStore");
const { AppError } = require("../../utils/errors");

async function handleResumeUpload(req, res, next) {
  try {
    if (!req.file) {
      throw new AppError("Upload a PDF resume in the `resume` field.", 400);
    }

    const isPdfUpload =
      req.file.mimetype === "application/pdf" ||
      req.file.originalname.toLowerCase().endsWith(".pdf");

    if (!isPdfUpload) {
      throw new AppError("Only PDF resume uploads are supported.", 400);
    }

    const resumeText = await parseResumeBuffer(req.file.buffer);

    if (!resumeText) {
      throw new AppError("The uploaded resume could not be parsed into text.", 400);
    }

    const metadata = {
      filename: req.file.originalname,
      updatedAt: new Date().toISOString()
    };

    sessionStore.setResumeText(resumeText, metadata);

    res.json({
      stored: true,
      characters: resumeText.length,
      preview: resumeText.slice(0, 240),
      metadata
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleResumeUpload
};
