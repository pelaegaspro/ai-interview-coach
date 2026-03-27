const { z } = require("zod");

const coachResponseSchema = z.object({
  shortAnswer: z.string(),
  bulletPoints: z.array(z.string()).max(5),
  starSuggestion: z.string(),
  keywords: z.array(z.string()).max(8),
  followUpSuggestion: z.string(),
  coachingTips: z.array(z.string()).max(4)
});

module.exports = {
  coachResponseSchema
};
