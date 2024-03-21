import { ApiHandler } from "sst/node/api";
import { AuthHandler, GoogleAdapter, Session, useSession } from "sst/node/auth";

// https://sst.dev/examples/how-to-add-google-login-to-your-sst-apps.html

declare module "sst/node/auth" {
  export interface SessionTypes {
    user: {
      sub?: string;
      name?: string;
      picture?: string;
      given_name?: string;
    };
  }
}

const GOOGLE_CLIENT_ID =
  "205193073027-vmg4kop4n9peraj5uiknfr73jbmfiiag.apps.googleusercontent.com";

export const signin = AuthHandler({
  providers: {
    google: GoogleAdapter({
      mode: "oidc",
      clientID: GOOGLE_CLIENT_ID,
      onSuccess: async (tokenset) => {
        const redirect = process.env.IS_LOCAL
          ? "http://localhost:3000"
          : "https://step.maxrchung.com";

        const { sub, name, given_name, picture } = tokenset.claims();

        return Session.cookie({
          redirect,
          type: "user",
          properties: {
            sub,
            name,
            given_name,
            picture,
          },
        });
      },
    }),
  },
});

export const user = ApiHandler(async () => {
  const session = useSession();

  console.log(session);

  if (session.type === "user") {
    return {
      statusCode: 200,
      body: JSON.stringify(session.properties),
    };
  }

  return {
    statusCode: 200,
    body: "{}",
  };
});

export const signout = ApiHandler(async () => {
  return {
    statusCode: 200,
    cookies: [
      "auth-token=asdf; HttpOnly; SameSite=None; Secure; Path=/; Expires=Thu Mar 20 2024 03:27:30 GMT-0700 (Pacific Daylight Time); Domain=qz2lf7t1yc.execute-api.us-west-1.amazonaws.com",
    ],
    headers: {
      "Set-Cookie":
        "auth-token=deleted; HttpOnly; SameSite=None; Secure; Path=/; Expires=Thu Mar 20 2024 03:27:30 GMT-0700 (Pacific Daylight Time); Domain=qz2lf7t1yc.execute-api.us-west-1.amazonaws.com",
    },
  };
});
