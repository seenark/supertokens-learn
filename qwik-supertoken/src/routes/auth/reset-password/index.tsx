import { $, component$, useSignal } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { submitNewPassword } from "supertokens-web-js/recipe/thirdpartyemailpassword";

export default component$(() => {
  const password = useSignal("");
  const to = useNavigate();

  const onSubmit = $(async () => {
    try {
      const response = await submitNewPassword({
        formFields: [
          {
            id: "password",
            value: password.value,
          },
        ],
      });
      if (response.status === "FIELD_ERROR") {
        response.formFields.forEach((formField) => {
          if (formField.id === "password") {
            // New password did not meet password criteria on the backend.
            alert(formField.error);
            return;
          }
        });
      } else if (response.status === "RESET_PASSWORD_INVALID_TOKEN_ERROR") {
        // the password reset token in the URL is invalid, expired, or already consumed
        alert("Password reset failed. Please try again");
        // back to the login scree.
        to("/signin");
        return;
      }
      // evertyhing is fine
      alert("password rest successfully");
      // go to home
      to("/");
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        // this may be a custom error message sent from the API by you.
        alert(err.message);
      } else {
        alert("Oops! Something went wrong.");
      }
    }
  });

  return (
    <div class="container">
      <h1 class="text-6xl mb-8">reset password</h1>
      <form
        preventdefault:submit
        onSubmit$={onSubmit}
        class="flex gap-4 items-center"
      >
        <label for="email">new password</label>
        <input
          name="password"
          type="text"
          placeholder="new password"
          bind:value={password}
          class="text-black px-4 py-2"
        />
        <button>change password</button>
      </form>
    </div>
  );
});
