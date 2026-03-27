const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

async function withTempFile(buffer, extension, callback) {
  const tempFilePath = path.join(
    os.tmpdir(),
    `ai-interview-coach-${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`
  );

  await fs.writeFile(tempFilePath, buffer);

  try {
    return await callback(tempFilePath);
  } finally {
    await fs.unlink(tempFilePath).catch(() => {});
  }
}

module.exports = {
  withTempFile
};
