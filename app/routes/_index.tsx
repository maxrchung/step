import { Button, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { uid } from "uid";
import { authenticator } from "~/auth/authenticator.server";
import { commitSession, getSession } from "~/auth/session.server";
import { createStep, getStep } from "~/db";
import PlusIcon from "~/icons/PlusIcon";

export const action: ActionFunction = async ({ request }) => {
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

  let id = uid();
  while ((await getStep(id)).Item) {
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

export default function Index() {
  return (
    <Container>
      <Flex flexDir="column" gap="5" align="center">
        <Heading size="lg">Step</Heading>
        <Text align="center">
          Web tool to create step patterns for dance games (DDR, PIU, SMX)
        </Text>
        <Form method="post">
          <Button
            display="flex"
            gap="2"
            alignItems="center"
            alignSelf="center"
            type="submit"
          >
            <PlusIcon />
            Create a new Step
          </Button>
        </Form>
      </Flex>
    </Container>
  );
}
