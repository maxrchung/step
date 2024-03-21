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
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import Nav from "./components/Nav";
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
  title = "Step",
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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      setSearchParams((prev) => {
        prev.delete("token");
        return prev;
      });

      // Retrigger user fetch
      window.location.replace(window.location.origin);
    }
  }, [navigate, searchParams, setSearchParams]);

  useEffect(() => {
    const getUser = async () => {
      console.log("user");

      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch(`${data.API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await response.json();
        setUser(json);
      } else {
        setUser({});
      }
    };

    getUser();
  }, [data.API_URL]);

  if (!user) {
    return;
  }

  return (
    <>
      <Nav user={user} apiUrl={data.API_URL} />
      <Outlet />
    </>
  );
};
