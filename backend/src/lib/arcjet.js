import "dotenv/config";
import arcjet, { shield, detectBot, slidingWindow } from "arcjet";
//import { isSpoofedBot } from "@arcjet/inspect";

let characteristics = ["headers", "path", "method"];
if(process.env.ARCJET_ENV === "production") {
  characteristics.push("ip");
}


const logger = {
  info: (...args) => console.log(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
  debug: (...args) => console.debug(...args),
};

const aj = arcjet({
  // Get your site key from https://app.arcjet.com and set it as an environment
  // variable rather than hard coding.
  key: process.env.ARCJET_KEY,
  log: console,
  client: { logger },
  characteristics: ["headers", "path", "method"],
  environment: process.env.ARCJET_ENV || "development",
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    slidingWindow({
      mode: "LIVE", // Enforce the rate limit
      interval: 60, // Time window in seconds
      max: 100, // Max requests per window per IP
    }),
  ],
});

export default aj;