import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not set. Create server/.env with JWT_SECRET (and optionally JWT_EXPIRES_IN).",
    );
  }
  return process.env.JWT_SECRET;
};

const generateToken = (payload) =>
  jwt.sign(payload, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export default generateToken;

