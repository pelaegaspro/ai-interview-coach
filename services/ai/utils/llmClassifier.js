const { getAIProvider, getSelectedProvider } = require("../providerFactory");

async function classifyWithLLM(question) {
  const provider = getAIProvider();
  const providerName = getSelectedProvider();
  const client = provider.getClient();

  const prompt = `Classify this interview question into ONE category:
behavioral, technical, sql, system_design, product, general
Return ONLY the category name. Question: ${question}`;

  if (providerName === "openai") {
    const res = await client.chat.completions.create({
      model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    });
    return res.choices[0].message.content.trim().toLowerCase();
  } else if (providerName === "groq") {
    const res = await client.chat.completions.create({
      model: process.env.GROQ_CHAT_MODEL || "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    });
    return res.choices[0].message.content.trim().toLowerCase();
  }

  return "general";
}

module.exports = { classifyWithLLM };
