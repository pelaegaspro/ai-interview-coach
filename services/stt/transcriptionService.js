const path = require("node:path");
const { getAIProvider } = require("../ai/providerFactory");
const { withTempFile } = require("../../utils/files");

async function transcribeBuffer({ buffer, filename = "chunk.webm", mimetype = "audio/webm", language }) {
  const provider = getAIProvider();
  const extension = path.extname(filename) || guessExtension(mimetype);

  return withTempFile(buffer, extension, async (filePath) => {
    const text = await provider.transcribeAudio({
      filePath,
      filename,
      mimetype,
      language
    });

    return String(text || "").trim();
  });
}

function guessExtension(mimetype) {
  if (!mimetype) {
    return ".webm";
  }

  if (mimetype.includes("mp4")) {
    return ".mp4";
  }

  if (mimetype.includes("mpeg")) {
    return ".mp3";
  }

  if (mimetype.includes("wav")) {
    return ".wav";
  }

  return ".webm";
}

module.exports = {
  transcribeBuffer
};
