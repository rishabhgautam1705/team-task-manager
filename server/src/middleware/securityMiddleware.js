import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import xss from "xss-clean";
import { allowedOrigins, csrfTokens, cookieOptions, isProduction } from "../config/security.js";

export const corsOptions = {
  origin(origin, callback) {
    // Emergency/health-check escape hatch.
    if (String(process.env.ALLOW_ALL_CORS).toLowerCase() === "true") return callback(null, true);


    if (!origin && !isProduction) return callback(null, true);
    if (origin && allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "X-CSRF-Token",
    "x-csrf-token",
    "X-CSRF-Token",
    "x-csrf_token",
  ],
};

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 300 : 1200,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 10 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

export const sanitizeRequest = [mongoSanitize(), xss(), hpp()];

export const issueCsrfToken = (req, res, next) => {
  if (!req.cookies?.csrfSecret) {
    const secret = csrfTokens.secretSync();
    res.cookie("csrfSecret", secret, cookieOptions(24 * 60 * 60 * 1000));
    req.csrfSecret = secret;
  } else {
    req.csrfSecret = req.cookies.csrfSecret;
  }
  next();
};

export const csrfProtection = (req, _res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();

  const headerToken =
    req.headers["x-csrf-token"] ||
    req.headers["x-csrf_token"] ||
    req.headers["x-csrf-token".toLowerCase()] ||
    req.headers["X-CSRF-Token"];

  const bodyToken = req.body?.csrfToken || req.body?.csrf_token;
  const queryToken = req.query?.csrfToken || req.query?.csrf_token;

  const token = headerToken || bodyToken || queryToken;

  if (token && req.cookies?.csrfSecret && csrfTokens.verify(req.cookies.csrfSecret, token)) {
    return next();
  }

  const error = new Error("Invalid or missing CSRF token");
  error.statusCode = 403;
  return next(error);
};
