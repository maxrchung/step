import { Avatar, Button, Flex, IconButton } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import GitHubIcon from "./GitHubIcon";
import GoogleIcon from "./GoogleIcon";
import type { SessionTypes } from "sst/node/auth";

interface NavProps {
  user: SessionTypes["user"];
}

export default function Nav({ user }: NavProps) {
  return (
    <Flex
      bg="gray.100"
      height={14}
      px={2}
      align="center"
      justify="space-between"
    >
      <Button as={Link} to="/">
        Step
      </Button>
      <Flex>
        <IconButton
          as={Link}
          to="https://github.com/maxrchung/step"
          target="_blank"
          aria-label="GitHub"
          icon={<GitHubIcon />}
        />
        <IconButton
          aria-label="Profile"
          icon={
            <Avatar
              name={user.given_name || user.name}
              src={user.picture}
              size="xs"
            />
          }
        />
      </Flex>
    </Flex>
  );
}
