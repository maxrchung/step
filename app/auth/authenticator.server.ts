import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/auth/session.server";
import { GoogleStrategy } from "remix-auth-google";
import { Config } from "sst/node/config";

export interface User {
  id: string;
  name: string;
  photo?: string;
}

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(sessionStorage);

export const CALLBACK_URL =
  process.env.NODE_ENV === "production"
    ? "https://step.maxrchung.com"
    : "http://localhost:3000/signin/callback";

authenticator.use(
  new GoogleStrategy(
    {
      clientID: Config.GOOGLE_CLIENT_ID,
      clientSecret: Config.GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
    },
    async ({ profile }) => {
      const { id, displayName, photos } = profile;

      return {
        id,
        name: displayName,
        photo: photos?.[0].value,
      };
    }
  )
);
