import type { VercelRequest, VercelResponse } from "@vercel/node";
import supabase from "../config/supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*"); // Adjust '*' to specific origin if needed
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  console.log("jskfbksjdbfjkb");
  try {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ error: "Method Not Allowed", code: "METHOD_NOT_ALLOWED" });
    }

    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        error: error.message,
        code: "AUTH_FAILED",
      });
    }

    const user = data?.user;

    if (!user?.user_metadata?.isVerified) {
      return res.status(403).json({
        error: "User is unverified",
        code: "USER_UNVERIFIED",
      });
    }

    return res.status(200).json({
      message: "User is verified",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      error: "An error occurred",
      code: "INTERNAL_ERROR",
    });
  }
}
