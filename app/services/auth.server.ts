import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";

interface User {
  sub: string;
  name?: string;
  picture?: string;
  given_name?: string;
}

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage);
