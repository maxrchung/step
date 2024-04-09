import { ActionFunction, json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth/authenticator.server";
import { getSession, commitSession } from "~/auth/session.server";
import { updateName } from "~/db";

export const action: ActionFunction = async ({ params, request }) => {
  invariant(params.stepId, "Step ID is missing.");

  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    const session = await getSession();
    session.flash("message", {
      text: "Sign-in is required to edit Step name.",
      status: "error",
    });

    return redirect("/signin", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  const id = params.stepId;
  const formData = await request.formData();
  const title = (formData.get("title") as string) ?? "";

  await updateName(id, title);

  const session = await getSession(request.headers.get("Cookie"));
  session.flash("message", {
    text: `You edited the name to <b>${title}</b>.`,
    status: "success",
  });

  return json(
    {},
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};
