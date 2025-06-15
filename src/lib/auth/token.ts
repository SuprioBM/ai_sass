// lib/auth/token.ts
import jwt from "jsonwebtoken";

export function createEmailToken(email: string): string {
  const secret = process.env.EMAIL_VERIFICATION_SECRET;
  if (!secret) {
    throw new Error("EMAIL_VERIFICATION_SECRET is not defined");
  }

  return jwt.sign({ email }, secret, { expiresIn: "1h" });
}
