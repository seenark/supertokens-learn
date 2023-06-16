import { $ } from "@builder.io/qwik";
import {
  getAuthorisationURLWithQueryParamsAndSetState,
  thirdPartySignInAndUp,
} from "supertokens-web-js/recipe/thirdpartyemailpassword";

export const googleSignInClicked = $(async () => {
  try {
    const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
      providerId: "google",
      authorisationURL: "http://localhost:5173/auth/callback/google", // this is website url that you provided to google cloud console -> credientials
    });
    window.location.assign(authUrl);
  } catch (err: any) {
    if (err.isSuperTokensGeneralError === true) {
      // this may be a custom error message sent from the API by you.
      alert(err.message);
    } else {
      alert("Oops! Something went wrong.");
    }
  }
});

export const handleGoogleCallback = $(async () => {
  try {
    const response = await thirdPartySignInAndUp();
    if (response.status !== "OK") {
      alert("no email provived by google. Please use another form of login");
      window.location.assign("/signin");
      return;
    }
    // everything going good
    if (response.createdNewUser) {
      alert("sign up successful");
    } else {
      alert("sign in successful");
    }
    window.location.assign("/");
  } catch (err: any) {
    if (err.isSuperTokensGeneralError === true) {
      // this may be a custom error message sent from the API by you.
      alert(err.message);
    } else {
      alert("Oops! Something went wrong.");
    }
  }
});
