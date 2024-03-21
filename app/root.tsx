import { ChakraProvider } from "@chakra-ui/react";
import { json, type MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import Nav from "./components/Nav";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import type { SessionTypes } from "sst/node/auth";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader() {
  return json({
    API_URL: process.env.API_URL ?? "",
  });
}

function Document({
  children,
  title = "App title",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function Wrapper() {
  return (
    <Document>
      <ChakraProvider>
        <Auth />
      </ChakraProvider>
    </Document>
  );
}

const Auth = () => {
  const data = useLoaderData<typeof loader>();
  const [user, setUser] = useState<SessionTypes["user"]>();

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`${data.API_URL}/user`, {
        credentials: "include",
      });
      const json = await response.json();
      setUser(json);
    };

    getUser();
  }, [data.API_URL]);

  if (!user) {
    return;
  }

  return (
    <>
      <Nav user={user} />
      <Outlet />
    </>
  );
};
