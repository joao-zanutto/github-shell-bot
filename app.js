import http from "http";
import { App } from "octokit";
import { createNodeMiddleware } from "@octokit/webhooks";
import handler from "./src/handler.js";

// Set configured values
const appId = process.env.APP_ID;
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
const secret = process.env.WEBHOOK_SECRET;

// Create an authenticated Octokit client authenticated as a GitHub App
const app = new App({
  appId,
  privateKey,
  webhooks: {
    secret,
  },
});

// Optional: Get & log the authenticated app's name
const { data } = await app.octokit.request("/app");

// Read more about custom logging: https://github.com/octokit/core.js#logging
app.octokit.log.debug(`Authenticated as '${data.name}'`);

app.webhooks.on("issue_comment.created", handler);

// Optional: Handle errors
app.webhooks.onError((error) => {
  if (error.name === "AggregateError") {
    console.log(`Error processing request: ${error.event}`);
  } else {
    console.log(error);
  }
});

// Launch a web server to listen for GitHub webhooks
const port = process.env.PORT || 3000;
const path = "/api/webhook";
const localWebhookUrl = `http://localhost:${port}${path}`;

// See https://github.com/octokit/webhooks.js/#createnodemiddleware for all options
const middleware = createNodeMiddleware(app.webhooks, { path });

http.createServer(middleware).listen(port, process.env.HOST, () => {
  console.log(`Server is listening for events at: ${localWebhookUrl}`);
  console.log("Press Ctrl + C to quit.");
});
