import csrf from "csrf";

const tokens = new csrf();

export const isProduction = process.env.NODE_ENV === "production";

export const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!isProduction) {
  allowedOrigins.push("http://localhost:5173", "http://127.0.0.1:5173");
}

export const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge,
});

export const clearCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  expires: new Date(0),
};

export const csrfTokens = tokens;
