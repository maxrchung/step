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
    // Remove all resources when non-prod stages are removed
    // https://docs.sst.dev/advanced/removal-policy
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }

    app.stack(function Site({ stack }) {
      const table = new Table(stack, "steps", {
        fields: {
          id: "string",
          created: "string",
          owner: "string",
          title: "string",
        },
        primaryIndex: { partitionKey: "id" },
        globalIndexes: {
          ownerIndex: {
            partitionKey: "owner",
            sortKey: "created",
            // Avoid writes to steps in GSI
            projection: ["id", "owner", "title", "created"],
          },
        },
      });

      const GOOGLE_CLIENT_ID = new Config.Secret(stack, "GOOGLE_CLIENT_ID");
      const GOOGLE_CLIENT_SECRET = new Config.Secret(
        stack,
        "GOOGLE_CLIENT_SECRET"
      );
      const COOKIE_SECRET = new Config.Secret(stack, "COOKIE_SECRET");

      const site = new RemixSite(stack, "site", {
        bind: [table, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, COOKIE_SECRET],
        customDomain:
          app.stage === "prod"
            ? {
                domainName: "step.maxrchung.com",
                hostedZone: "maxrchung.com",
              }
            : undefined,
      });

      stack.addOutputs({
        siteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
