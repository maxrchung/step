import {
  Avatar,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import type { SessionTypes } from "sst/node/auth";
import GitHubIcon from "./GitHubIcon";
import { ArrowUpIcon, PlusSquareIcon } from "@chakra-ui/icons";

interface NavProps {
  user: SessionTypes["user"];
  apiUrl: string;
}

export default function Nav({ user, apiUrl }: NavProps) {
  const token = localStorage.getItem("token");

  return (
    <Flex bg="gray.100" height={14} px={2} align="center" justify="center">
      <IconButton
        as={Link}
        to="/"
        aria-label="Home"
        title="Home"
        icon={<ArrowUpIcon />}
      />
      <IconButton
        aria-label="Create"
        title="Create"
        icon={<PlusSquareIcon />}
      />
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
          icon={
            <Avatar
              name={user.given_name || user.name}
              src={user.picture}
              size="xs"
            />
          }
        />
        <MenuList>
          {token ? (
            <MenuItem
              onClick={async () => {
                localStorage.removeItem("token");

                // Force rerender so user data is refetched
                window.location.reload();
              }}
            >
              Sign out
            </MenuItem>
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
