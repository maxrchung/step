import {
  Button,
  Container,
  Flex,
  Heading,
  Link as ChakraLink,
  Text,
  IconButton,
} from "@chakra-ui/react";
import {
  ActionFunction,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { uid } from "uid";
import { authenticator } from "~/auth/authenticator.server";
import { commitSession, getSession } from "~/auth/session.server";
import { createStep, getStep, getSteps } from "~/db";
import DeleteIcon from "~/icons/DeleteIcon";
import EditIcon from "~/icons/EditIcon";
import PlusIcon from "~/icons/PlusIcon";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);

  const steps = !user ? [] : await getSteps(user.id);
  return json({ steps });
};

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

export default function Index() {
  const { steps } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Flex flexDir="column" gap="5" align="center">
        <Heading size="lg">Step</Heading>
        <Text align="center">
          A web tool to create step patterns for dance games (DDR, PIU, SMX)
        </Text>
        <Form method="post">
          <Button
            display="flex"
            gap="2"
            alignItems="center"
            alignSelf="center"
            type="submit"
            onSubmit={() => {}}
          >
            <PlusIcon />
            Create a new Step
          </Button>
        </Form>

        <Flex flexDir="column" width="100%">
          {steps.map(({ id, title }, index) => (
            <Flex
              key={id}
              align="center"
              justify="space-between"
              bgColor={index % 2 === 1 ? "gray.50" : undefined}
              p={2}
              borderRadius="md"
              gap={2}
            >
              <ChakraLink as={Link} to={`/${id}`} minW={0}>
                {title}
              </ChakraLink>

              <Flex>
                <IconButton
                  as={Link}
                  to={`/${id}`}
                  aria-label="Edit"
                  title="Edit"
                  icon={<EditIcon />}
                  variant="ghost"
                />

                <IconButton
                  aria-label="Delete"
                  title="Delete"
                  icon={<DeleteIcon />}
                  variant="ghost"
                />
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Container>
  );
}
