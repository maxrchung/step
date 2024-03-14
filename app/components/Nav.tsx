import { SearchIcon } from "@chakra-ui/icons";
import { Button, Flex, IconButton } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import GitHubIcon from "./GitHubIcon";

export default function Nav() {
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
      </Flex>
    </Flex>
  );
}
