import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import GoogleSignInButton from "~/components/GoogleSignInButton";

export async function loader() {
  return json({
    API_URL: process.env.API_URL ?? "",
  });
}

export default function Login() {
  const data = useLoaderData<typeof loader>();

  return <GoogleSignInButton url={`${data.API_URL}/auth/google/authorize`} />;
}
