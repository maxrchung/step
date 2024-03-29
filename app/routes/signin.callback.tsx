import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "~/auth/authenticator.server";
import { commitSession, getSession } from "~/auth/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.authenticate("google", request);
  const session = await getSession(request.headers.get("cookie"));

  if (user) {
    session.set(authenticator.sessionKey, user);
    session.flash("message", {
      text: "You've successfully signed in.",
      status: "success",
    });

    return redirect("/", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } else {
    session.flash("message", {
      text: "We failed to sign you in. This could be a temporary issue.",
      status: "error",
    });

    return redirect("/login", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }
}
