import SuperTokens from "supertokens-node";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import EmailVerification, {
  EmailVerificationClaim,
} from "supertokens-node/recipe/emailverification";
import { middleware, errorHandler } from "supertokens-node/framework/express";
import Session from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import UserRoles from "supertokens-node/recipe/userroles";

export function setupSuperToken() {
  let { Google } = ThirdPartyEmailPassword;

  SuperTokens.init({
    supertokens: {
      connectionURI: "http://localhost:3567",
      apiKey: "this-is-a-unsecured-api-keys",
    },
    appInfo: {
      appName: "learn-supertoken",
      apiDomain: "http://localhost:3333",
      websiteDomain: "http://localhost:5173",
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      ThirdPartyEmailPassword.init({
        signUpFeature: {
          formFields: [
            {
              id: "firstname",
            },
            {
              id: "dob",
              optional: true,
            },
          ],
        },
        override: {
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,
              emailPasswordSignUpPOST: async (input) => {
                if (
                  originalImplementation.emailPasswordSignUpPOST === undefined
                ) {
                  throw Error("Should never come here");
                }

                // First we call the original implementation
                let response =
                  await originalImplementation.emailPasswordSignUpPOST(input);

                // If sign up was successful
                if (response.status === "OK") {
                  // We can get the form fields from the input like this
                  let formFields = input.formFields;
                  let user = response.user;
                  const userid = user.id;
                  console.log("supertokens create user: ", userid, formFields);
                  // save other fields into our database
                  // ...
                  const addRole = await UserRoles.addRoleToUser(userid, "user");
                  console.log("add role: ", addRole);
                }

                return response;
              },
            };
          },
        },
        providers: [
          Google({
            clientId:
              "310491773472-ek42bkpp481roeabag3715h3dqglea8b.apps.googleusercontent.com",
            clientSecret: "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",
          }),
        ],
      }),
      UserRoles.init({
        skipAddingRolesToAccessToken: false,
        skipAddingPermissionsToAccessToken: false,
      }),
      EmailVerification.init({
        mode: "REQUIRED", // or "OPTIONAL"
      }),
      Session.init({
        // exposeAccessTokenToFrontendInCookieBasedAuth: true,
      }),
      Dashboard.init(),
    ],
  });
  console.log("supertokens init");
  return {
    cors: {
      origin: "http://localhost:5173",
      headers: SuperTokens.getAllCORSHeaders(),
    },
    middleware,
    errorHandler,
    emailVerify: {
      verifySession,
      EmailVerificationClaim,
    },
  };
}
