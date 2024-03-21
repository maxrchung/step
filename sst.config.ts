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

      const api = new Api(stack, "api", {
        routes: {
          "GET /user": "functions/auth.user",
        },
      });
      const auth = new Auth(stack, "auth", {
        authenticator: {
          handler: "functions/auth.signin",
        },
      });
      auth.attach(stack, { api });

      const site = new RemixSite(stack, "site", {
        bind: [table, api],
        environment: {
          API_URL: api.url,
        },
      });

      stack.addOutputs({
        siteUrl: site.url,
        apiUrl: api.url,
      });
    });
  },
} satisfies SSTConfig;