const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "ai-interview-coach-backend",
    timestamp: new Date().toISOString()
  });
});

app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
