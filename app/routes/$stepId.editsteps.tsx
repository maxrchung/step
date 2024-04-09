import { ActionFunction, json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth/authenticator.server";
import { getSession, commitSession } from "~/auth/session.server";
import { updateSteps } from "~/db";

export const action: ActionFunction = async ({ params, request }) => {
  invariant(params.stepId, "Step ID is missing.");

  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    const session = await getSession();
    session.flash("message", {
      text: "Sign-in is required to edit Step.",
      status: "error",
    });

    return redirect("/signin", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  const id = params.stepId;
  const { steps } = await request.json();

  await updateSteps(id, steps);

  return json({});
};
