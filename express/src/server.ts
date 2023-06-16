import { json, urlencoded } from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { setupSuperToken } from "./supertokens";

export function createServer() {
  const app = express();
  const supertokens = setupSuperToken();
  const { verifySession, EmailVerificationClaim } = supertokens.emailVerify;

  console.log("supertokens", supertokens);
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cookieParser())
    .use(
      cors({
        origin: [supertokens.cors.origin],
        allowedHeaders: ["content-type", ...supertokens.cors.headers],
        credentials: true,
      })
    )
    .use(supertokens.middleware());

  app.get("/healthz", (_req, res) => {
    res.send("ok");
  });

  app.get(
    "/email-should-verified",
    verifySession({
      overrideGlobalClaimValidators: async (globalValidators) => [
        ...globalValidators,
        EmailVerificationClaim.validators.isVerified(),
      ],
    }),
    async (_req, res) => {
      res.send("your email verified");
    }
  );

  app.get("/need-session", verifySession(), async (req, res) => {
    const userId = (req as any).session.getUserId();
    console.log("userid", userId);
    res.send("you are has session");
  });

  app.use(supertokens.errorHandler());

  return app;
}
