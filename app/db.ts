import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { Table } from "sst/node/table";

const db = DynamoDBDocument.from(new DynamoDBClient({}));

enum Style {
  DDR_SINGLE = "DDR_SINGLE",
  DDR_DOUBLE = "DDR_DOUBLE",
  PIU_SINGLE = "PIU_SINGLE",
  PIU_DOUBLE = "PIU_DOUBLE",
  SMX_SINGLE = "SMX_SINGLE",
  SMX_DOUBLE = "SMX_DOUBLE",
}

interface Step {
  id: string;
  title: string;
  style: Style;
  steps: number[][];
  owner: string;
  created: string;
  updated: string;
}

export const createStep = (id: string, owner: string) => {
  const iso = new Date().toISOString();
  const item: Step = {
    id,
    owner,
    title: "My Step",
    style: Style.DDR_SINGLE,
    steps: [],
    created: iso,
    updated: iso,
  };

  return db.put({
    TableName: Table.steps.tableName,
    Item: item,
  });
};

export const getStep = async (id: string) => {
  const repsonse = await db.get({
    TableName: Table.steps.tableName,
    Key: {
      id,
    },
  });

  return repsonse.Item ? (repsonse.Item as Step) : undefined;
};

export const getSteps = async (owner: string) => {
  const response = await db.query({
    TableName: Table.steps.tableName,
    IndexName: "ownerIndex",
    ExpressionAttributeNames: {
      "#owner": "owner",
    },
    ExpressionAttributeValues: {
      ":owner": owner,
    },
    KeyConditionExpression: "#owner = :owner",
    // Reverse so items are ordered by descending create time
    ScanIndexForward: false,
  });

  return response.Items ? (response.Items as Step[]) : [];
};
