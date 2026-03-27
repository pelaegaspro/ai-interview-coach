const dotenv = require("dotenv");
const { AppError } = require("../../utils/errors");

dotenv.config();

let providerInstance = null;

function getSelectedProvider() {
  return (process.env.AI_PROVIDER || "openai").trim().toLowerCase();
}

function getAIProvider() {
  if (providerInstance) {
    return providerInstance;
  }

  const providerName = getSelectedProvider();

  if (providerName === "groq") {
    providerInstance = require("./providers/groqProvider");
    return providerInstance;
  }

  if (providerName === "openai") {
    providerInstance = require("./providers/openaiProvider");
    return providerInstance;
  }

  throw new AppError(`Unsupported AI_PROVIDER value: ${providerName}`, 500);
}

module.exports = {
  getAIProvider,
  getSelectedProvider
};
