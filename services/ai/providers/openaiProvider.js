const fs = require("node:fs");
const OpenAI = require("openai");
const { zodResponseFormat } = require("openai/helpers/zod");
const { coachResponseSchema } = require("../coachSchema");
const { AppError } = require("../../../utils/errors");
const { buildCoachSystemPrompt, buildCoachUserPrompt } = require("../../../utils/promptBuilder");

let client = null;

async function withRetry(fn, retries = 3, delayMs = 1000) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      const isRateLimit = err?.status === 429 || err?.message?.includes("429");

      if (!isRateLimit || attempt === retries - 1) {
        throw err;
      }

      await new Promise((resolve) => {
        setTimeout(resolve, delayMs * Math.pow(2, attempt));
      });
    }
  }
}

function getClient() {
  if (client) {
    return client;
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new AppError("OPENAI_API_KEY is missing. Add it to your .env file.", 500);
  }

  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  return client;
}

async function generateCoaching({ transcript, mode, resumeText }) {
  const openai = getClient();
  const completion = await withRetry(() =>
    openai.chat.completions.parse({
      model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: buildCoachSystemPrompt({ mode, resumeText })
        },
        {
          role: "user",
          content: buildCoachUserPrompt(transcript)
        }
      ],
      response_format: zodResponseFormat(coachResponseSchema, "interview_coach_response")
    })
  );

  return completion.choices[0]?.message?.parsed;
}

async function transcribeAudio({ filePath }) {
  const openai = getClient();

  const transcription = await withRetry(() =>
    openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: process.env.OPENAI_TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe",
      language: process.env.TRANSCRIBE_LANGUAGE || "en"
    })
  );

  return transcription.text || "";
}

module.exports = {
  generateCoaching,
  transcribeAudio
};
