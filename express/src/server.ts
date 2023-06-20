import { json, urlencoded } from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { setupSuperToken } from "./supertokens";
import UserRoles from "supertokens-node/recipe/userroles";

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

  // add new permissions to role use this fn as well in will merge permissions
  app.post("/auth/create-role", async (req, res) => {
    type body = {
      role: string;
      permissions: string[];
    };
    const { role, permissions } = req.body as body;
    const response = await UserRoles.createNewRoleOrAddPermissions(
      role,
      permissions
    );
    if (response.createdNewRole === false) {
      console.log(`role: ${role} already exists`);
      res.status(400).send(`role: ${role} already exists`);
    }
    res.status(201).send(`role: ${role} created`);
  });

  app.get("/auth/get-all-roles", async (req, res) => {
    const all = await UserRoles.getAllRoles();
    res.send(all);
  });

  app.get("/auth/get-permissions-from-role", async (req, res) => {
    const role = req.query.role as string;
    const response = await UserRoles.getPermissionsForRole(role);
    res.send({
      role,
      permissions: (response as { permissions: string[] }).permissions,
    });
  });

  app.get(
    "/required-role-user",
    verifySession({
      overrideGlobalClaimValidators(
        globalClaimValidators,
        session,
        userContext
      ) {
        return [
          ...globalClaimValidators,
          UserRoles.UserRoleClaim.validators.includes("user"),
        ];
      },
    }),
    async (req, res) => {
      res.send("you has role 'user'");
    }
  );

  app.use(supertokens.errorHandler());

  return app;
}
