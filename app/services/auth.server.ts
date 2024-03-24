import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { GoogleStrategy } from "remix-auth-google";
import { Config } from "sst/node/config";

interface User {
  id: string;
  name: string;
  photo?: string;
}

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage);

const googleStrategy = new GoogleStrategy(
  {
    clientID: Config.GOOGLE_CLIENT_ID,
    clientSecret: Config.GOOGLE_CLIENT_SECRET,
    callbackURL:
      process.env.NODE_ENV === "production"
        ? "https://step.maxrchung.com"
        : "http://localhost:3000",
  },
  async ({ profile }) => {
    const { id, displayName, photos } = profile;
    return {
      id,
      name: displayName,
      photo: photos?.[0].value,
    };
  }
);

authenticator.use(googleStrategy);
