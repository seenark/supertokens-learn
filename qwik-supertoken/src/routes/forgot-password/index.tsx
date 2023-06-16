import { $, component$, useSignal } from "@builder.io/qwik";
import { sendPasswordResetEmail } from "supertokens-web-js/recipe/thirdpartyemailpassword";

export default component$(() => {
  const email = useSignal("");

  const onSubmit = $(async () => {
    try {
      const response = await sendPasswordResetEmail({
        formFields: [
          {
            id: "email",
            value: email.value,
          },
        ],
      });
      if (response.status === "FIELD_ERROR") {
        response.formFields.forEach((formField) => {
          if (formField.id === "email") {
            alert("email not found");
          }
        });
        return;
      } // everthing going good
      alert("please check your email for password reset link");
      return;
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        alert(err.message);
      } else {
        alert("Oops! Something went wrong.");
      }
    }
  });

  return (
    <div class="container">
      <h1 class="text-6xl mb-8">forgot password</h1>
      <form
        preventdefault:submit
        onSubmit$={onSubmit}
        class="flex gap-4 items-center"
      >
        <label for="email">email</label>
        <input
          name="email"
          type="text"
          placeholder="email"
          bind:value={email}
          class="text-black px-4 py-2"
        />
        <button>sent email</button>
      </form>
    </div>
  );
});
