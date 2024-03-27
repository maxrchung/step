import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/auth/authenticator.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.authenticate("google", request, {
    successRedirect: "/",
    failureRedirect: "/signin",
  });
}
