import { ChakraProvider, Flex, useToast } from "@chakra-ui/react";
import { json } from "@remix-run/node";
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
import { useContext, useEffect } from "react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { withEmotionCache } from "@emotion/react";
import { ClientStyleContext, ServerStyleContext } from "./emotion/context";
import { authenticator } from "./auth/authenticator.server";
import { commitSession, getSession } from "./auth/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const message = session.get("message") || undefined;
  const user = (await authenticator.isAuthenticated(request)) || undefined;

  return json(
    { user, message },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
}

export const links: LinksFunction = () => [
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
          <title>Step</title>
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

export default function App() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <Document>
      <Toaster />
      <Flex gap="5" flexDir="column">
        <Nav user={user} />

        <Outlet />
      </Flex>
    </Document>
  );
}

function Toaster() {
  const { message } = useLoaderData<typeof loader>();
  const toast = useToast();

  useEffect(() => {
    if (message) {
      const { text, status } = message;
      toast({
        // Yolo?
        description: <div dangerouslySetInnerHTML={{ __html: text }} />,
        status,
      });
    }
  }, [message]);

  return null;
}
