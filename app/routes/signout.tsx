import { ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/auth/authenticator.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticator.logout(request, { redirectTo: "/" });
};
