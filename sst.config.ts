import type { SSTConfig } from "sst";
import { Api, Auth, RemixSite, Table } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "step",
      region: "us-west-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const table = new Table(stack, "steps", {
        fields: {
          id: "string",
        },
        primaryIndex: { partitionKey: "id" },
      });

      const site = new RemixSite(stack, "site", {
        bind: [table],
      });
      stack.addOutputs({
        url: site.url,
      });

      const api = new Api(stack, "api");

      const auth = new Auth(stack, "auth", {
        authenticator: {
          handler: "functions/auth.handler",
        },
      });

      auth.attach(stack, { api });
    });
  },
} satisfies SSTConfig;
