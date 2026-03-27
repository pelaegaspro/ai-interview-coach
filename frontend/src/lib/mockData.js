export const MOCK_FLOW = [
  {
    question: "Tell me about yourself and your background.",
    transcript: "I am a software engineer with 5 years of experience building scalable enterprise SaaS applications. I recently worked on a major migration from legacy architecture to serverless microservices...",
    answer: {
      shortAnswer: "Highlight specific metrics from your migration project (e.g., performance improvements or cost savings). Connect your 5 years of experience to the required skills for this role.",
    }
  },
  {
    question: "What is your approach to system design when dealing with high-traffic web architectures?",
    transcript: "I usually start by identifying the core bottlenecks. I look at where we can implement caching layers using Redis or Memcached, and I ensure the database read replicas are correctly configured for horizontal scaling.",
    answer: {
      shortAnswer: "Mention tradeoffs between consistency and availability (CAP theorem). Suggest adding a message queue (like Kafka) to handle asynchronous high-throughput tasks.",
      score: 82,
      feedback: "Good start, but dive deeper into decoupling services."
    }
  },
  {
    question: "Tell me about a time you had to handle a critical production outage.",
    transcript: "We had a database crash right in the middle of a big launch. I immediately jumped into the logs, found the anomalous query that caused a deadlock, killed it, and then implemented a circuit breaker pattern to prevent it from happening again.",
    answer: {
      shortAnswer: "Structure this using the STAR method (Situation, Task, Action, Result). Excellent mention of the circuit breaker! Be sure to explicitly quantify the downtime and resolution speed.",
      score: 91,
      feedback: "Very strong technical response, just needs structured delivery."
    }
  }
];
