import express from "express";
import cors from "cors";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";

import { auth } from "./config/auth.js";
import { requireAuth } from "./middleware/auth.middleware.js";
import { requireRole } from "./middleware/role.middleware.js";
import healthRoutes from "./routes/health.route.js";
import authTestRoutes from "./routes/authTest.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Mount Better Auth BEFORE express.json()
// Better Auth handles sign-up, sign-in, sign-out, session retrieval, etc.
app.all("/api/auth/*splat", toNodeHandler(auth));

// Body parser for all subsequent application routes
app.use(express.json());

// Application Routes

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Hulu-Bedeje API is running!"
    });
});

app.get("/test-auth", requireAuth, (req, res) => {
    res.json({
        success: true,
        message: "Google OAuth signup/login successful!",
        user: req.user,
        session: req.session,
    });
});

// This is for testing whether signing in with google works or not. It will be removed once we have our frontend setup for that

app.get("/auth/google", async (req, res) => {
  try {
    const authResponse = await auth.api.signInSocial({
      body: {
        provider: "google",
        callbackURL: "http://localhost:5001/api/v1/auth/test/test-auth",
      },
      headers: fromNodeHeaders(req.headers),
      asResponse: true
    });

    // Extract and forward the state/PKCE cookies to the browser
    const setCookie = authResponse.headers.getSetCookie
      ? authResponse.headers.getSetCookie()
      : authResponse.headers.get("set-cookie");

    if (setCookie) {
      res.setHeader("set-cookie", setCookie);
    }

    const data = await authResponse.json();

    if (data?.url) {
      return res.redirect(data.url);
    }

    return res.status(400).json({ error: "Failed to generate Google OAuth URL" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth/test", authTestRoutes);

// 404 Fallback Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Application Error:", err);
  res.status(500).json({
    success: false,
    message: "An internal server error occurred",
  });
});

export default app;