import {
  Button,
  Container,
  Flex,
  Heading,
  Link as ChakraLink,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth/authenticator.server";
import { getSteps } from "~/db";
import DeleteIcon from "~/icons/DeleteIcon";
import EditIcon from "~/icons/EditIcon";
import PlusIcon from "~/icons/PlusIcon";
import Create from "./create";
import Delete from "./$stepId.delete";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);

  const steps = !user ? [] : await getSteps(user.id);
  return json({ steps });
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

        <Create>
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
        </Create>

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

                <Delete id={id} title={title}>
                  <IconButton
                    aria-label="Delete"
                    title="Delete"
                    icon={<DeleteIcon />}
                    variant="ghost"
                    type="submit"
                  />
                </Delete>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Container>
  );
}
