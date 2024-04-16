import { Button } from "@chakra-ui/react";
import { LogoGoogle } from "~/icons";
import CommonIcon from "~/icons/CommonIcon";

export default function GoogleSignInButton() {
  return (
    <Button display="flex" gap="2" alignItems="center" type="submit">
      <CommonIcon as={LogoGoogle} />
      Sign in with Google
    </Button>
  );
}
