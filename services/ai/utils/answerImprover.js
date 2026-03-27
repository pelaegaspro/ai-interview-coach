const { getAIProvider, getSelectedProvider } = require("../providerFactory");

async function improveAnswer(question, answer) {
  const provider = getAIProvider();
  const providerName = getSelectedProvider();
  const client = provider.getClient();

  const prompt = `Improve this interview answer with better clarity, depth and structure.

Question: ${question}
Answer: ${answer}

Return improved version in same JSON format WITHOUT altering the core schema keys (shortAnswer, bulletPoints, coachingTips, followUpSuggestion, keywords).`;

  try {
    if (providerName === "openai") {
      const res = await client.chat.completions.create({
        model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      return JSON.parse(res.choices[0].message.content);
    } else if (providerName === "groq") {
      const res = await client.chat.completions.create({
        model: process.env.GROQ_CHAT_MODEL || "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      return JSON.parse(res.choices[0].message.content);
    }
  } catch (e) {
    return null;
  }
}

module.exports = { improveAnswer };
