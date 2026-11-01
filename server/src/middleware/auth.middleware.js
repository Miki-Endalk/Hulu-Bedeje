import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth.js";

export async function requireAuth(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Active session required",
      });
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (err) {
    console.error("Authentication error:", err);

    return res.status(500).json({
        success: false,
        message: "Internal server error during authentication",
    });
  }
}