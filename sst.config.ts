import type { SSTConfig } from "sst";
import { Config, RemixSite, Table } from "sst/constructs";

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

      const GOOGLE_CLIENT_ID = new Config.Secret(stack, "GOOGLE_CLIENT_ID");
      const GOOGLE_CLIENT_SECRET = new Config.Secret(
        stack,
        "GOOGLE_CLIENT_SECRET"
      );
      const COOKIE_SECRET = new Config.Secret(stack, "COOKIE_SECRET");

      const site = new RemixSite(stack, "site", {
        bind: [table, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, COOKIE_SECRET],
      });

      stack.addOutputs({
        siteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
