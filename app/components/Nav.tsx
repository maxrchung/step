import {
  Avatar,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Link, useNavigate } from "@remix-run/react";
import type { SessionTypes } from "sst/node/auth";

interface NavProps {
  user: SessionTypes["user"];
  apiUrl: string;
}

export default function Nav({ user, apiUrl }: NavProps) {
  const navigate = useNavigate();

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
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Account"
            icon={
              <Avatar
                name={user.given_name || user.name}
                src={user.picture}
                size="xs"
              />
            }
          />
          <MenuList>
            {user.sub ? (
              <MenuItem
                onClick={async () => {
                  await fetch(`${apiUrl}/signout`, { credentials: "include" });

                  // Force rerender so user data is refetched
                  navigate(".", { replace: true });
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
    </Flex>
  );
}
