import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import ThirdPartyEmailPassword from "supertokens-web-js/recipe/thirdpartyemailpassword";
import EmailVerification from "supertokens-web-js/recipe/emailverification";

export function setupSuperTokens() {
  SuperTokens.init({
    appInfo: {
      apiDomain: "http://localhost:3333",
      apiBasePath: "/auth",
      appName: "learn-supertoken",
    },
    recipeList: [
      EmailVerification.init(),
      Session.init(),
      ThirdPartyEmailPassword.init(),
    ],
  });

  console.log("supertokens init");
}
