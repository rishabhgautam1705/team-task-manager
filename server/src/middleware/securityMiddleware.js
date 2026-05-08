import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import xss from "xss-clean";
import { allowedOrigins, csrfTokens, isProduction } from "../config/security.js";

export const corsOptions = {
  origin(origin, callback) {
    if (!origin && !isProduction) return callback(null, true);
    if (origin && allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "X-CSRF-Token"],
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
    res.cookie("csrfSecret", secret, {
      httpOnly: true,
      secure: false, // Allow on localhost
      sameSite: "none", // Allow cross-origin
    });
    req.csrfSecret = secret;
  } else {
    req.csrfSecret = req.cookies.csrfSecret;
  }
  next();
};

export const csrfProtection = (req, _res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const token = req.headers["x-csrf-token"];
  if (token && req.cookies?.csrfSecret && csrfTokens.verify(req.cookies.csrfSecret, token)) {
    return next();
  }
  const error = new Error("Invalid or missing CSRF token");
  error.statusCode = 403;
  return next(error);
};
