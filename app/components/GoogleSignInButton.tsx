import { Button } from "@chakra-ui/react";
import GoogleIcon from "./GoogleIcon";

export default function GoogleSignInButton() {
  return (
    <Button display="flex" gap="2" alignItems="center" type="submit">
      <GoogleIcon />
      Sign in with Google
    </Button>
  );
}
