import {
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
import UserIcon from "~/icons/UserIcon";
import TwitterIcon from "~/icons/TwitterIcon";

interface NavProps {
  user?: User;
}

export default function Nav({ user }: NavProps) {
  return (
    <Flex
      bg="gray.100"
      height={14}
      px={2}
      align="center"
      justify="space-between"
      pos="sticky"
      top="0"
      zIndex="sticky"
    >
      <Flex>
        <IconButton
          as={Link}
          to="/"
          aria-label="Home"
          title="Home"
          icon={<HomeIcon />}
        />

        <IconButton aria-label="Create" title="Create" icon={<PlusIcon />} />

        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="User"
            title="User"
            icon={<UserIcon />}
          />
          <MenuList>
            {user ? (
              <Form action="/signout" method="POST">
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

      <Flex>
        <IconButton
          as={Link}
          to="https://github.com/maxrchung/step"
          target="_blank"
          aria-label="GitHub"
          title="GitHub"
          icon={<GitHubIcon />}
        />

        <IconButton
          as={Link}
          to="https://twitter.com/maxrchung"
          target="_blank"
          aria-label="Twitter"
          title="Twitter"
          icon={<TwitterIcon />}
        />
      </Flex>
    </Flex>
  );
}
