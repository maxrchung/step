import { useToast } from "@chakra-ui/react";
import { ActionFunction, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { PropsWithChildren, ReactNode, useEffect } from "react";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth/authenticator.server";
import { getSession, commitSession } from "~/auth/session.server";
import { deleteStep, getStep } from "~/db";

export const action: ActionFunction = async ({ params, request }) => {
  invariant(params.stepId, "Step ID is missing.");

  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    const session = await getSession();
    session.flash("message", {
      text: "Sign-in is required to delete a Step.",
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

  await deleteStep(id);

  const session = await getSession(request.headers.get("Cookie"));
  session.flash("message", {
    text: `You deleted ${step?.title ? `<b>${step?.title}</b>` : "a Step"}.`,
    status: "success",
  });

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

interface DeleteProps {
  id: string;
  title: string;
  children: ReactNode;
}

export default function Delete({ id, title, children }: DeleteProps) {
  return (
    <Form
      action={`/${id}/delete`}
      method="delete"
      onSubmit={(event) => {
        const response = confirm(
          `Are you sure you want to delete ${title}? This cannot be undone.`
        );
        if (!response) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </Form>
  );
}
