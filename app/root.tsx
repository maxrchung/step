import { ChakraProvider, Flex, Spacer } from "@chakra-ui/react";
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
import type { LinksFunction } from "@remix-run/node";
import { cssBundleHref } from "@remix-run/css-bundle";

export async function loader() {
  return json({
    API_URL: process.env.API_URL ?? "",
  });
}

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),

  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap",
  },
];

const Document = withEmotionCache(
  ({ children }: { children: React.ReactNode }, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
    }, []);

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
          <title></title>
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(" ")}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          <ChakraProvider>{children}</ChakraProvider>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
);

export default function Wrapper() {
  return (
    <Document>
      <Auth />
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
    <Flex gap="5" flexDir="column">
      <Nav user={user} apiUrl={data.API_URL} />

      <Outlet />
    </Flex>
  );
};
