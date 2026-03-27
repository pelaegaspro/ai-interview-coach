const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../../../../analytics.json");

function loadAnalytics() {
  if (!fs.existsSync(FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch (e) {
    return [];
  }
}

function saveAnalytics(data) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Failed to save analytics:", e);
  }
}

module.exports = { loadAnalytics, saveAnalytics };
