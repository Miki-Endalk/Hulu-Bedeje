import { betterAuth } from "better-auth";
import pool from "./db.js";

export const auth = betterAuth({
  database: pool,
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins:  [
    "http://localhost:3000" // Frontend dev URL
  ],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
  },

  user: {
    additionalFields: {
        role: {
            type: "string",
            required: false,
            defaultValue: "customer",
            input: false
        }
    }
  },
});