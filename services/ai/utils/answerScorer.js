const { getAIProvider, getSelectedProvider } = require("../providerFactory");

async function scoreAnswer(question, answer) {
  const provider = getAIProvider();
  const providerName = getSelectedProvider();
  const client = provider.getClient();

  const prompt = `Evaluate the quality of this interview answer.

Criteria:
- Clarity
- Relevance
- Depth
- Structure

Return STRICT JSON ONLY:
{
  "score": 85,
  "feedback": "short feedback"
}

Question: ${question}

Answer:
${answer}`;

  try {
    if (providerName === "openai") {
      const res = await client.chat.completions.create({
        model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        response_format: { type: "json_object" }
      });
      return JSON.parse(res.choices[0].message.content);
    } else if (providerName === "groq") {
      const res = await client.chat.completions.create({
        model: process.env.GROQ_CHAT_MODEL || "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        response_format: { type: "json_object" }
      });
      return JSON.parse(res.choices[0].message.content);
    }
  } catch (e) {
    return { score: null, feedback: "Could not evaluate" };
  }

  return { score: null, feedback: "" };
}

module.exports = { scoreAnswer };
