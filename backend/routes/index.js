const express = require("express");
const multer = require("multer");
const { handleAsk } = require("../controllers/askController");
const { handleTranscribe } = require("../controllers/transcribeController");
const { handleResumeUpload } = require("../controllers/resumeController");
const { clearResumeText } = require("../store/sessionStore");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

router.post("/transcribe", upload.single("audio"), handleTranscribe);
router.post("/ask", handleAsk);
router.post("/resume/upload", upload.single("resume"), handleResumeUpload);
router.delete("/resume", (_req, res) => {
  clearResumeText();
  res.json({ cleared: true });
});

module.exports = router;
