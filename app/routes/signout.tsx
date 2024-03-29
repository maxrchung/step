import { redirect } from "@remix-run/node";
import { commitSession, getSession } from "~/auth/session.server";

export const action = async () => {
  // Lol https://sergiodxa.com/tutorials/destroy-user-session-and-while-setting-a-flash-message-in-remix
  // Apparently if we don't provide value to getSession we will create a new session
  const session = await getSession();
  session.flash("message", {
    text: "You've been signed out.",
    status: "success",
  });

  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};
