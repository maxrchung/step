import { useToast } from "@chakra-ui/react";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { PropsWithChildren, useEffect } from "react";
import { uid } from "uid";
import { authenticator } from "~/auth/authenticator.server";
import { getSession, commitSession } from "~/auth/session.server";
import { getStep, getStepsCount, createStep } from "~/db";

const MAX_STEPS = 100;

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    const session = await getSession();
    session.flash("message", {
      text: "Sign-in is required to create a Step.",
      status: "error",
    });

    return redirect("/signin", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  const count = await getStepsCount(user.id);
  if (count >= MAX_STEPS) {
    return json({
      error: `We failed to create a Step. Users are currently limited to ${MAX_STEPS} Steps.`,
    });
  }

  let id = uid();
  while (await getStep(id)) {
    id = uid();
  }
  await createStep(id, user.id);

  const session = await getSession(request.headers.get("Cookie"));
  session.flash("message", {
    text: "You created a new Step.",
    status: "success",
  });

  return redirect(`/${id}`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Create({ children }: PropsWithChildren) {
  const data = useActionData<typeof action>();
  const toast = useToast();

  useEffect(() => {
    if (data?.error) {
      toast({
        description: <div dangerouslySetInnerHTML={{ __html: data?.error }} />,
        status: "error",
      });
    }
  }, [data]);

  return (
    <Form action="/create" method="post">
      {children}
    </Form>
  );
}
