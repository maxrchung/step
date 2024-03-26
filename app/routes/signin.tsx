import { Card, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import GoogleSignInButton from "~/components/GoogleSignInButton";
import { authenticator } from "~/auth/authenticator.server";

export async function loader() {
  return json({
    API_URL: process.env.API_URL ?? "",
  });
}

export async function action({ request }: LoaderFunctionArgs) {
  console.log("action");
  return await authenticator.authenticate("google", request);
}

export default function Login() {
  const data = useLoaderData<typeof loader>();

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
