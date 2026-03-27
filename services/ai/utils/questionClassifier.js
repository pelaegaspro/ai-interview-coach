function classifyQuestion(question) {
  const q = question.toLowerCase();

  let score = 0;
  let type = "general";

  if (q.includes("tell me about") || q.includes("challenge") || q.includes("experience") || q.includes("conflict") || q.includes("mistake") || q.includes("time when")) {
    type = "behavioral";
    score = 0.9;
  } else if (q.includes("sql") || q.includes("join") || q.includes("query") || q.includes("database schema")) {
    type = "sql";
    score = 0.95;
  } else if (q.includes("design") || q.includes("architecture") || q.includes("scale") || q.includes("system")) {
    type = "system_design";
    score = 0.85;
  } else if (q.includes("algorithm") || q.includes("code") || q.includes("python") || q.includes("regression") || q.includes("implement") || q.includes("debug") || q.includes("framework")) {
    type = "technical";
    score = 0.8;
  } else if (q.includes("product") || q.includes("metrics") || q.includes("roadmap") || q.includes("launch") || q.includes("prioritize") || q.includes("gto")) {
    type = "product";
    score = 0.85;
  } else {
    type = "general";
    score = 0.4;
  }

  return { type, confidence: score };
}

module.exports = { classifyQuestion };
