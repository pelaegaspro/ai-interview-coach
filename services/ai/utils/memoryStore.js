const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../../../../memory.json");

function loadMemory() {
  if (!fs.existsSync(FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch (e) {
    return {};
  }
}

function saveMemory(memory) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(memory, null, 2));
  } catch (e) {
    console.error("Failed to save memory to JSON:", e);
  }
}

function similarity(a, b) {
  const A = a.toLowerCase().trim().split(/\s+/);
  const B = b.toLowerCase().trim().split(/\s+/);
  const match = A.filter(word => B.includes(word));
  return match.length / Math.max(A.length, B.length);
}

function findSimilar(memory, mode, question) {
  const q = question.toLowerCase().trim();

  let bestMatch = null;
  let bestScore = 0;

  for (const key in memory) {
    if (key.startsWith(`${mode}:`)) {
       const storedQ = key.replace(`${mode}:`, "");
       const score = similarity(q, storedQ);

       if (score > 0.6 && score > bestScore) {
         bestMatch = memory[key];
         bestScore = score;
       }
    }
  }

  return bestMatch;
}

module.exports = { loadMemory, saveMemory, findSimilar };
