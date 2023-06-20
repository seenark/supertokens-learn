import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import Session from "supertokens-web-js/recipe/session";
import { googleSignInClicked } from "~/supertokens/google";

export default component$(() => {
  const signout = $(() => {
    Session.signOut();
    console.log("sign out");
  });
  const userId = useSignal("");

  useVisibleTask$(async () => {
    try {
      userId.value = await Session.getUserId();
    } catch (err: any) {
      console.log("no user session");
    }
  });

  return (
    <>
      <div class="container flex gap-8 flex-wrap">
        <h1>user id: {userId.value}</h1>
        <Link href="/signup" class="border border-red-300 px-4 py-2 rounded">
          signup
        </Link>
        <Link href="/signin" class="border border-blue-300 px-4 py-2 rounded">
          signin
        </Link>
        <div
          class="border border-green-700 px-4 py-2 rounded cursor-pointer"
          onClick$={googleSignInClicked}
        >
          signin with Google
        </div>
        <button
          class="border text-black bg-yellow-200 px-4 py-2 rounded"
          onClick$={signout}
        >
          signout
        </button>
        <Link
          href="/forgot-password"
          class="border border-pink-300 px-4 py-2 rounded"
        >
          forgot password
        </Link>
        <Link
          href="/need-session"
          class="border border-purple-300 px-4 py-2 rounded"
        >
          need session
        </Link>
        <Link
          href="/need-email-verified"
          class="border border-purple-300 px-4 py-2 rounded"
        >
          need verified email
        </Link>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
