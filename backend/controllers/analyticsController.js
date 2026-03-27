const { loadAnalytics } = require("../store/analyticsStore");

function getAnalytics(req, res) {
  const data = loadAnalytics();

  const avgScore = data.length > 0 ? data.reduce((sum, d) => sum + (d.score || 0), 0) / data.length : 0;

  const typeStats = {};

  data.forEach(d => {
    if (d.type) {
      typeStats[d.type] = (typeStats[d.type] || 0) + 1;
    }
  });

  res.json({
    totalQuestions: data.length,
    averageScore: Math.round(avgScore || 0),
    typeBreakdown: typeStats
  });
}

module.exports = { getAnalytics };
