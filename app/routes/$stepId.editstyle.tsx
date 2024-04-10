import { ActionFunction, json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth/authenticator.server";
import { getSession, commitSession } from "~/auth/session.server";
import { Style, getStep, updateStyle } from "~/db";

export const action: ActionFunction = async ({ params, request }) => {
  invariant(params.stepId, "Step ID is missing.");

  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    const session = await getSession();
    session.flash("message", {
      text: "Sign-in is required to edit style.",
      status: "error",
    });

    return redirect("/signin", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  const id = params.stepId;
  const step = await getStep(id);
  if (user.id !== step?.owner) {
    return json({}, { status: 403 });
  }

  const formData = await request.formData();
  const style = formData.get("style") as Style;

  await updateStyle(id, style);

  const session = await getSession(request.headers.get("Cookie"));
  session.flash("message", {
    text: `You edited the style to <b>${style}</b>.`,
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
