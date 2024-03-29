import { Button, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { ActionFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { authenticator } from "~/auth/authenticator.server";
import PlusIcon from "~/icons/PlusIcon";

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
  console.log("user", user);
  return null;
};

export default function Index() {
  return (
    <Container>
      <Flex flexDir="column" gap="5" align="center">
        <Heading size="lg">Step</Heading>
        <Text>
          Step is a small tool to create step patterns for dance games. I made
          this mostly with the intention to help me keep notes for practicing
          certain parts of songs.
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
