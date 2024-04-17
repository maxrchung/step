import { Container, Flex, Heading, Text } from "@chakra-ui/react";
import {
  ActionFunctionArgs,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import GoogleSignInButton from "~/components/GoogleSignInButton";
import { authenticator } from "~/auth/authenticator.server";

// Maybe not the greatest, but authenticator.authenticate() doesn't work if
// you're already signed in.
export async function loader({ request }: LoaderFunctionArgs) {
  if (await authenticator.isAuthenticated(request)) {
    return redirect("/");
  }
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
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
