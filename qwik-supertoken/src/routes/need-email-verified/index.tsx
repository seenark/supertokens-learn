import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import Session from "supertokens-web-js/recipe/session";
import { EmailVerificationClaim } from "supertokens-web-js/recipe/emailverification";
import { useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
  const to = useNavigate();
  const isVerifying = useSignal(false);

  useVisibleTask$(async () => {
    isVerifying.value = true;
    try {
      const doesSessionExist = await Session.doesSessionExist();
      console.log("page need-verified-email");
      console.log("doesSessionExist", doesSessionExist);
      if (!doesSessionExist) {
        to("/signin");
        return;
      }

      const validationError = await Session.validateClaims();
      if (validationError.length > 0) {
        for (const err of validationError) {
          if (err.validatorId === EmailVerificationClaim.id) {
            alert("email is not verified");
            to("/signin");
            return;
          }
        }
        return;
      }
      if (validationError.length === 0) {
        // user already verified the email
        return;
      }
    } finally {
      isVerifying.value = false;
    }
  });

  return (
    <>
      <h1>Required email verified</h1>
      {isVerifying.value === false && <h2>you can continue</h2>}
      {isVerifying.value === true && <h2>loading...</h2>}
    </>
  );
});
