module.exports.TYPE_TEMPLATES = {
  behavioral: `
FORMAT AS STAR METHOD:
- Situation (Brief context)
- Task (What needed to be done)
- Action (What YOU specifically did)
- Result (Quantifiable outcome)
`,
  technical: `
- Explain step-by-step
- Mention specific technologies or algorithms
- Include real-world constraints
`,
  sql: `
- Suggest SQL structures (SELECT, JOIN, GROUP BY, window functions)
- Explain the logic briefly
- Mention query optimization (indexes, avoiding subqueries) if relevant
`,
  system_design: `
- Outline Requirements (Functional/Non-Functional)
- Propose High-Level Architecture
- Discuss Data Flow & Scaling (Load balancers, caching, sharding)
- Identify Bottlenecks & Trade-offs
`,
  product: `
- Clarify the goal and target persona first
- Define success metrics
- Discuss prioritization and rollout strategy
`,
  general: `
- Be concise and direct to the point
`
};
