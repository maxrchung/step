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
import {
  AddOutline,
  HomeOutline,
  LogoGithub,
  LogoTwitter,
  PersonOutline,
} from "~/icons";
import CommonIcon from "~/icons/CommonIcon";
import Create from "~/routes/create";

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
      // Depends on how I feel but I kind of don't want a sticky nav bar
      // pos="sticky"
      // top="0"
      // zIndex="sticky"
    >
      <Flex>
        <IconButton
          as={Link}
          to="/"
          aria-label="Home"
          title="Home"
          icon={<CommonIcon as={HomeOutline} />}
        />

        <Create>
          <IconButton
            aria-label="Create"
            title="Create"
            icon={<CommonIcon as={AddOutline} />}
            type="submit"
          />
        </Create>

        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="User"
            title="User"
            icon={<CommonIcon as={PersonOutline} />}
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
          icon={<CommonIcon as={LogoGithub} />}
        />

        <IconButton
          as={Link}
          to="https://twitter.com/maxrchung"
          target="_blank"
          aria-label="Twitter"
          title="Twitter"
          icon={<CommonIcon as={LogoTwitter} />}
        />
      </Flex>
    </Flex>
  );
}
