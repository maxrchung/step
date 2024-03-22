import { Card, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import GoogleSignInButton from "~/components/GoogleSignInButton";

export async function loader() {
  return json({
    API_URL: process.env.API_URL ?? "",
  });
}

export default function Login() {
  const data = useLoaderData<typeof loader>();

  return (
    <Container>
      <Card>
        <Flex flexDir="column" gap="5" padding="5" align="center">
          <Heading>Sign in</Heading>
          <Text>Sign in to edit your own charts.</Text>
          <GoogleSignInButton url={`${data.API_URL}/auth/google/authorize`} />
        </Flex>
      </Card>
    </Container>
  );
}
