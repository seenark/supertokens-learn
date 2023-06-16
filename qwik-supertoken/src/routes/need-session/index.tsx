import { $, component$, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import Session from "supertokens-web-js/recipe/session";

export default component$(() => {
  const to = useNavigate();
  const doesSessionExist = $(async () => {
    const isThereSession = await Session.doesSessionExist();
    if (!isThereSession) {
      // user not logged in yet
      to("/signin");
      return;
    }
    // user logged in already
    return;
  });
  useVisibleTask$(() => {
    doesSessionExist();
  });
  return (
    <>
      <h1>Need Session</h1>
    </>
  );
});
