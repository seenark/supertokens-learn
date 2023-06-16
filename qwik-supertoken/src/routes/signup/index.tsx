import { $, component$, useSignal } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { emailPasswordSignUp } from "supertokens-web-js/recipe/thirdpartyemailpassword";

export default component$(() => {
  const email = useSignal<string>("");
  const password = useSignal<string>("");
  const to = useNavigate();

  const onSubmit = $(async () => {
    try {
      const response = await emailPasswordSignUp({
        formFields: [
          {
            id: "email",
            value: email.value,
          },
          {
            id: "password",
            value: password.value,
          },
        ],
      });
      if (response.status === "FIELD_ERROR") {
        response.formFields.forEach((formField) => {
          if (formField.id === "email") {
            alert("email error:" + formField.error);
            return;
          }
          if (formField.id === "passworda") {
            alert("password error:" + formField.error);
            return;
          }
          alert("other error");
          return;
        });
      }
      to("/");
    } catch (error: any) {
      if (error.isSuperTokensGeneralError === true) {
        alert(error.message);
      } else {
        alert("Oops something went wrong");
      }
    }
  });

  return (
    <div class="container">
      <h1 class="text-2xl">Sign up form</h1>
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
        <label for="password">password</label>
        <input
          name="password"
          type="text"
          placeholder="password"
          bind:value={password}
          class="text-black px-4 py-2"
        />
        <button>sign up</button>
      </form>
    </div>
  );
});
