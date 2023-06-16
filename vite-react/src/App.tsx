import { useEffect } from "react";
import { BrowserRouter, Routes, Link } from "react-router-dom";
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
        <button onClick={toAuthPath}>Sign in</button>
        <button onClick={onSignOut}>sign out</button>
      </BrowserRouter>
    </SuperTokensWrapper>
  );
}

export default App;
