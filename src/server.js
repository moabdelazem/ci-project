import applicationConfig from "./config/config.js";
import app from "./app.js";

// Start the server
async function startServer() {
  const port = applicationConfig.port;
  app.listen(port, () => {
    console.log(
      `Server is running on port ${port} in ${applicationConfig.env} mode.`
    );
  });
}

startServer();
