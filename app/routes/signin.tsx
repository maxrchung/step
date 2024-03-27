import { Card, Container, Flex, Heading, Text } from "@chakra-ui/react";
import {
  LoaderFunction,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import GoogleSignInButton from "~/components/GoogleSignInButton";
import { authenticator } from "~/auth/authenticator.server";

export async function action({ request }: LoaderFunctionArgs) {
  return await authenticator.authenticate("google", request);
}

export default function SignIn() {
  return (
    <Container>
      <Card>
        <Flex flexDir="column" gap="5" padding="5" align="center">
          <Heading>Sign in</Heading>
          <Text>Sign in to edit your own charts.</Text>
          <Form method="post">
            <GoogleSignInButton />
          </Form>
        </Flex>
      </Card>
    </Container>
  );
}
