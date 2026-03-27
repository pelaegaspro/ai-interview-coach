const fs = require("node:fs");
const Groq = require("groq-sdk");
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

  if (!process.env.GROQ_API_KEY) {
    throw new AppError("GROQ_API_KEY is missing. Add it to your .env file.", 500);
  }

  client = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  return client;
}

async function generateCoaching({ transcript, mode, experience, jobJd, model, resumeText, type, onChunk, signal }) {
  const groq = getClient();
<<<<<<< Updated upstream
  const completion = await withRetry(() =>
    groq.chat.completions.create({
      model: process.env.GROQ_CHAT_MODEL || "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: {
        type: "json_object"
      },
      messages: [
        {
          role: "system",
          content: `${buildCoachSystemPrompt({ mode, resumeText })}\nReturn valid JSON only.`
        },
        {
          role: "user",
          content: buildCoachUserPrompt(transcript)
        }
      ]
    })
  );
=======
  let mappedModel = process.env.GROQ_CHAT_MODEL || "llama-3.3-70b-versatile";
  if (model === "gpt-4.1") mappedModel = "mixtral-8x7b-32768";

  let stream;
  try {
    stream = await groq.chat.completions.create({
    model: mappedModel,
    temperature: 0.2,
    stream: true,
    response_format: {
      type: "json_object"
    },
    messages: [
      {
        role: "system",
        content: `${buildCoachSystemPrompt({ mode, experience, jobJd, resumeText, type })}\nReturn valid JSON only.`
      },
      {
        role: "user",
        content: buildCoachUserPrompt(transcript)
      }
    ]
  }, { signal });
  } catch (e) {
    if (e.name === "AbortError" || e.message?.toLowerCase().includes("abort")) return {};
    throw e;
  }
>>>>>>> Stashed changes

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
  const groq = getClient();

<<<<<<< Updated upstream
  const transcription = await withRetry(() =>
    groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: process.env.GROQ_TRANSCRIBE_MODEL || "whisper-large-v3-turbo",
      language: process.env.TRANSCRIBE_LANGUAGE || "en",
      response_format: "json",
      temperature: 0
    })
  );
=======
  const transcriptionOptions = {
    file: fs.createReadStream(filePath),
    model: process.env.GROQ_TRANSCRIBE_MODEL || "whisper-large-v3-turbo",
    response_format: "json",
    temperature: 0
  };

  const finalLanguage = (language && language !== "auto") ? language : process.env.TRANSCRIBE_LANGUAGE;
  if (finalLanguage && finalLanguage !== "auto") {
    transcriptionOptions.language = finalLanguage;
  }

  const transcription = await groq.audio.transcriptions.create(transcriptionOptions);
>>>>>>> Stashed changes

  return transcription.text || "";
}

module.exports = {
  generateCoaching,
  transcribeAudio,
  getClient
};
