const express = require("express");
const multer = require("multer");
const { handleAsk } = require("../controllers/askController");
const { handleTranscribe } = require("../controllers/transcribeController");
const { handleResumeUpload } = require("../controllers/resumeController");

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

module.exports = router;
