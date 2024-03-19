import { Button } from "@chakra-ui/react";
import GoogleIcon from "./GoogleIcon";

interface GoogleSignInButtonProps {
  url: string;
}

export default function GoogleSignInButton({ url }: GoogleSignInButtonProps) {
  return (
    <Button as="a" display="flex" gap="2" alignItems="center" href={url}>
      <GoogleIcon />
      Sign in with Google
    </Button>
  );
}
