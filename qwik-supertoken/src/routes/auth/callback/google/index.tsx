import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { handleGoogleCallback } from "~/supertokens/google";

export default component$(() => {
  useVisibleTask$(async () => {
    handleGoogleCallback();
  });

  return (
    <>
      <h1>Google sign in callback</h1>
    </>
  );
});
