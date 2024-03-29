import { Container, Flex, Heading, Text } from "@chakra-ui/react";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import GoogleSignInButton from "~/components/GoogleSignInButton";
import { authenticator } from "~/auth/authenticator.server";

export async function action({ request }: LoaderFunctionArgs) {
  return await authenticator.authenticate("google", request);
}

export default function SignIn() {
  return (
    <Container>
      <Flex flexDir="column" gap="5" align="center">
        <Heading size="lg">Sign-in</Heading>
        <Text>Sign in to edit your own Steps.</Text>
        <Form method="post">
          <GoogleSignInButton />
        </Form>
      </Flex>
    </Container>
  );
}
