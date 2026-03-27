function normalizeWhitespace(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanList(items, limit) {
  const seen = new Set();

  return (Array.isArray(items) ? items : [])
    .map((item) => normalizeWhitespace(item))
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

function truncateText(text, maxChars) {
  const value = normalizeWhitespace(text);

  if (value.length <= maxChars) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxChars - 3)).trim()}...`;
}

module.exports = {
  normalizeWhitespace,
  cleanList,
  truncateText
};
