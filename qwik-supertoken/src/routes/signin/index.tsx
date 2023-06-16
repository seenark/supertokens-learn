import { $, component$, useSignal } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { emailPasswordSignIn } from "supertokens-web-js/recipe/thirdpartyemailpassword";

export default component$(() => {
  const email = useSignal("");
  const password = useSignal("");
  const to = useNavigate();

  const onSubmit = $(async () => {
    try {
      const response = await emailPasswordSignIn({
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
        response.formFields.forEach((f) => {
          if (f.id === "email") {
            alert(f.error);
          }
        });
        return;
      } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
        alert("email password combination is incorrect");
        return;
      }
      // everything going good
      alert("sign in successfully");
      to("/");
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        alert(err.message);
        return;
      }
      alert("Oops something went wrong");
      console.log(err);
      return;
    }
  });

  return (
    <div>
      <h1>Sign in</h1>
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
