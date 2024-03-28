import {
  Avatar,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Form, Link } from "@remix-run/react";
import { User } from "~/auth/authenticator.server";
import HomeIcon from "~/icons/HomeIcon";
import GitHubIcon from "~/icons/GitHubIcon";
import PlusIcon from "~/icons/PlusIcon";

interface NavProps {
  user?: User;
}

export default function Nav({ user }: NavProps) {
  return (
    <Flex bg="gray.100" height={14} px={2} align="center" justify="center">
      <IconButton
        as={Link}
        to="/"
        aria-label="Home"
        title="Home"
        icon={<HomeIcon />}
      />
      <IconButton aria-label="Create" title="Create" icon={<PlusIcon />} />
      <IconButton
        as={Link}
        to="https://github.com/maxrchung/step"
        target="_blank"
        aria-label="GitHub"
        title="GitHub"
        icon={<GitHubIcon />}
      />
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Account"
          title="Account"
          icon={<Avatar name={user?.name} src={user?.photo} size="xs" />}
        />
        <MenuList>
          {user ? (
            <Form action="signout" method="POST">
              <MenuItem type="submit">Sign out</MenuItem>
            </Form>
          ) : (
            <MenuItem as={Link} to="/signin">
              Sign in
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </Flex>
  );
}
