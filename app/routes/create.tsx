import { useToast } from "@chakra-ui/react";
import {
  ActionFunctionArgs,
  json,
  redirect,
  redirectDocument,
} from "@remix-run/node";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import { PropsWithChildren, useEffect } from "react";
import { uid } from "uid";
import { authenticator } from "~/auth/authenticator.server";
import { getSession, commitSession } from "~/auth/session.server";
import { getStep, getStepsCount, createStep } from "~/db.server";

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
    return json(
      {
        error: `We failed to create a Step. Users are limited to ${MAX_STEPS} Steps.`,
      },
      { status: 400 }
    );
  }

  const formData = await request.formData();
  const title = (formData.get("title") as string) ?? "";
  const date = (formData.get("date") as string) ?? "";

  let id = uid();
  while (await getStep(id)) {
    id = uid();
  }
  await createStep(id, user.id, title, date);

  const session = await getSession(request.headers.get("Cookie"));
  session.flash("message", {
    text: "You created a new Step.",
    status: "success",
  });

  // It's possible to create a new step in nav bar while already on the stepId
  // route. This causes some issues with state management since the step is new
  // but the state still thinks you are on previous page. To fix this,
  // redirectDocument instead of redirect seems to work as it forces the
  // useStates to run again. Maybe not the optimal solution but works for me for
  // now.
  return redirectDocument(`/${id}`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Create({ children }: PropsWithChildren) {
  const data = useActionData<typeof action>();
  const toast = useToast();
  const submit = useSubmit();

  useEffect(() => {
    if (data?.error) {
      toast({
        description: <div dangerouslySetInnerHTML={{ __html: data?.error }} />,
        status: "error",
      });
    }
  }, [data]);

  return (
    <Form
      action="/create"
      method="post"
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData();
        const date = new Date();
        // Seems kind of jank but will let me submit with proper locale
        formData.append("title", date.toLocaleString());
        // We also pass date directly so the create/update time match title
        formData.append("date", date.toISOString());

        // This feels pretty wack but w/e
        submit(formData, { method: "post", action: "/create" });
      }}
    >
      {children}
    </Form>
  );
}
