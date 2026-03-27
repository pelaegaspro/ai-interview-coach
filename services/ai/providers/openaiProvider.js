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

async function generateCoaching({ transcript, mode, experience, jobJd, model, resumeText, type, onChunk, signal }) {
  const openai = getClient();
<<<<<<< Updated upstream
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
=======
  let mappedModel = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
  if (model === "gpt-5") mappedModel = "gpt-4o";
  else if (model === "gpt-4.1") mappedModel = "gpt-4-turbo";
>>>>>>> Stashed changes

  let stream;
  try {
    stream = await openai.chat.completions.create({
      model: mappedModel,
      temperature: 0.2,
      stream: true,
      messages: [
        {
          role: "system",
          content: buildCoachSystemPrompt({ mode, experience, jobJd, resumeText, type })
        },
        {
          role: "user",
          content: buildCoachUserPrompt(transcript)
        }
      ],
      response_format: { type: "json_object" }
    }, { signal });
  } catch (e) {
    if (e.name === "AbortError" || e.message?.toLowerCase().includes("abort")) return {};
    throw e;
  }

  let fullText = "";
  for await (const chunk of stream) {
    const delta = chunk.choices?.[0]?.delta?.content || "";
    if (delta) {
      fullText += delta;
      if (onChunk) onChunk(delta, fullText);
    }
  }

  try {
    return JSON.parse(fullText);
  } catch (e) {
    return {};
  }
}

async function transcribeAudio({ filePath, language }) {
  const openai = getClient();

<<<<<<< Updated upstream
  const transcription = await withRetry(() =>
    openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: process.env.OPENAI_TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe",
      language: process.env.TRANSCRIBE_LANGUAGE || "en"
    })
  );
=======
  const transcriptionOptions = {
    file: fs.createReadStream(filePath),
    model: process.env.OPENAI_TRANSCRIBE_MODEL || "whisper-1"
  };

  const finalLanguage = (language && language !== "auto") ? language : process.env.TRANSCRIBE_LANGUAGE;
  if (finalLanguage && finalLanguage !== "auto") {
    transcriptionOptions.language = finalLanguage;
  }

  const transcription = await openai.audio.transcriptions.create(transcriptionOptions);
>>>>>>> Stashed changes

  return transcription.text || "";
}

module.exports = {
  generateCoaching,
  transcribeAudio,
  getClient
};
