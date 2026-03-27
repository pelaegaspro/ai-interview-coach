const http = require("node:http");
const dotenv = require("dotenv");
const app = require("./app");
const { DEFAULT_BACKEND_PORT } = require("../utils/constants");

dotenv.config();

let server = null;

function startServer(port = DEFAULT_BACKEND_PORT) {
  if (server) {
    return Promise.resolve(server);
  }

  return new Promise((resolve, reject) => {
    const instance = http.createServer(app);

    instance.on("error", (error) => {
      reject(error);
    });

    instance.listen(port, "127.0.0.1", () => {
      server = instance;
      resolve(server);
    });
  });
}

function stopServer(activeServer = server) {
  if (!activeServer) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    activeServer.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      if (activeServer === server) {
        server = null;
      }

      resolve();
    });
  });
}

if (require.main === module) {
  startServer()
    .then(() => {
      console.log(`AI Interview Coach backend listening on http://127.0.0.1:${DEFAULT_BACKEND_PORT}`);
    })
    .catch((error) => {
      console.error("Unable to start backend:", error);
      process.exit(1);
    });
}

module.exports = {
  startServer,
  stopServer
};
