const { z } = require("zod");

const coachResponseSchema = z.object({
  shortAnswer: z.string().default(""),
  bulletPoints: z.array(z.string()).max(5).default([]),
  starSuggestion: z.string().default(""),
  keywords: z.array(z.string()).max(8).default([]),
  followUpSuggestion: z.string().default(""),
  coachingTips: z.array(z.string()).max(4).default([])
});

module.exports = {
  coachResponseSchema
};
