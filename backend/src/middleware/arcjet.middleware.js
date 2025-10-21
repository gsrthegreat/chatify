import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
  try {
    // ✅ Safely extract IP address
    const ip =
      req.ip ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      "127.0.0.1"; // fallback for local development

    // ✅ Pass structured request data to Arcjet
    const decision = await aj.protect({
      ip,
      userAgent: req.headers["user-agent"],
      path: req.path,
      method: req.method,
      headers: req.headers,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Rate limit exceeded. Please try again later." });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied." });
      } else {
        return res
          .status(403)
          .json({ message: "Access denied by security policy." });
      }
    }

    // ✅ Detect spoofed bots (fake Googlebot, etc.)
    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected.",
      });
    }

    next();
  } catch (error) {
    console.error("Arcjet Protection Error:", error);
    next();
  }
};
