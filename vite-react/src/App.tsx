import { useEffect } from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import * as reactRouterDom from "react-router-dom";

import SuperTokens, {
  SuperTokensWrapper,
  redirectToAuth,
} from "supertokens-auth-react";
import Thirdpartyemailpassword, {
  Google,
  Apple,
  Github,
  Gitlab,
  Discord,
  Facebook,
} from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import EmailVerification from "supertokens-auth-react/recipe/emailverification";
import { EmailVerificationPreBuiltUI } from "supertokens-auth-react/recipe/emailverification/prebuiltui";
import { ThirdPartyEmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/thirdpartyemailpassword/prebuiltui";
import Session from "supertokens-auth-react/recipe/session";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { UserRoleClaim } from "supertokens-auth-react/recipe/userroles";

import "./App.css";

SuperTokens.init({
  appInfo: {
    appName: "learn-supertoken",
    apiDomain: "http://localhost:3333",
    websiteDomain: "http://localhost:5173",
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    Thirdpartyemailpassword.init({
      signInAndUpFeature: {
        signUpForm: {
          formFields: [
            {
              id: "email",
              label: "email label",
              placeholder: "email placeholder",
            },
            {
              id: "firstname",
              label: "Firstname",
              placeholder: "Firstname",
              validate: async (value) => {
                console.log("firstname", value);
                return undefined;
              },
            },
            {
              id: "dob",
              label: "Date of birth",
              placeholder: "dd/mm/yyyy",
              optional: true,
            },
          ],
        },

        providers: [
          Google.init(),
          Apple.init(),
          Github.init(),
          Facebook.init(),
          Discord.init(),
          Gitlab.init(),
        ],
      },
    }),
    EmailVerification.init({
      mode: "REQUIRED",
    }),
    Session.init(),
  ],
});
console.log("supertoken init");

function App() {
  async function onSignOut() {
    await Thirdpartyemailpassword.signOut();
    // or
    // await Session.signOut();
  }

  useEffect(() => {
    (async () => {
      if (await Session.doesSessionExist()) {
        const userId = await Session.getUserId();
        console.log("userId", userId);
      }
    })();
  }, []);

  function User() {
    const claimValue = Session.useClaimValue(UserRoleClaim);
    console.log("claimValue", claimValue);
    if (claimValue.loading || claimValue.doesSessionExist === false) {
      return <div>you are not logged in</div>;
    }
    const roles = claimValue.value;
    if (!Array.isArray(roles) || !roles.includes("user")) {
      return <div>you don't has role user</div>;
    }
    return (
      <>
        <div>user has 'user' role</div>
      </>
    );
  }

  function toAuthPath() {
    redirectToAuth({
      show: "signin",
      redirectBack: true,
    });
  }

  return (
    <SuperTokensWrapper>
      <BrowserRouter>
        <Routes>
          {getSuperTokensRoutesForReactRouterDom(reactRouterDom, [
            ThirdPartyEmailPasswordPreBuiltUI,
            EmailVerificationPreBuiltUI,
          ])}
        </Routes>
        <User />
        <button onClick={toAuthPath}>Sign in</button>
        <button onClick={onSignOut}>sign out</button>
      </BrowserRouter>
    </SuperTokensWrapper>
  );
}

export default App;
