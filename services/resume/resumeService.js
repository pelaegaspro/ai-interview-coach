const pdfParse = require("pdf-parse");
const { normalizeWhitespace } = require("../../utils/text");

async function parseResumeBuffer(buffer) {
  const result = await pdfParse(buffer);
  return normalizeWhitespace(result.text || "");
}

module.exports = {
  parseResumeBuffer
};
