// app/services/session.server.ts
import { AlertStatus } from "@chakra-ui/react";
import { SessionData, createCookieSessionStorage } from "@remix-run/node";
import { Config } from "sst/node/config";

interface FlashData {
  message: {
    text: string;
    status: AlertStatus;
  };
}

// export the whole sessionStorage object
export const sessionStorage = createCookieSessionStorage<
  SessionData,
  FlashData
>({
  cookie: {
    name: "_session", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [Config.COOKIE_SECRET], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

// you can also export the methods individually for your own usage
export const { getSession, commitSession, destroySession } = sessionStorage;
