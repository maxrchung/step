import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { Table } from "sst/node/table";

const db = DynamoDBDocument.from(new DynamoDBClient({}));

export enum Style {
  DDR_SINGLE = "DDR Single",
  DDR_DOUBLE = "DDR Double",
  PIU_SINGLE = "PIU Single",
  PIU_DOUBLE = "PIU Double",
  SMX_SINGLE = "SMX Single",
  SMX_DOUBLE = "SMX Double",
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

interface OwnerStep {
  id: string;
  title: string;
  owner: string;
  created: string;
}

export const createStep = (id: string, owner: string) => {
  const iso = new Date().toISOString();
  const item: Step = {
    id,
    owner,
    title: "My Step",
    style: Style.DDR_SINGLE,
    steps: [[], [], [], []],
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
    Key: { id },
  });

  return repsonse.Item ? (repsonse.Item as Step) : undefined;
};

export const getSteps = async (owner: string) => {
  const response = await db.query({
    TableName: Table.steps.tableName,
    IndexName: "ownerIndex",
    ExpressionAttributeNames: { "#owner": "owner" },
    ExpressionAttributeValues: { ":owner": owner },
    KeyConditionExpression: "#owner = :owner",
    // Reverse so items are ordered by descending create time
    ScanIndexForward: false,
  });

  return response.Items ? (response.Items as OwnerStep[]) : [];
};

export const getStepsCount = async (owner: string) => {
  const response = await db.query({
    TableName: Table.steps.tableName,
    IndexName: "ownerIndex",
    ExpressionAttributeNames: { "#owner": "owner" },
    ExpressionAttributeValues: { ":owner": owner },
    KeyConditionExpression: "#owner = :owner",
    ProjectionExpression: "id",
  });

  return response.Count ?? 0;
};

export const deleteStep = (id: string) =>
  db.delete({
    TableName: Table.steps.tableName,
    Key: { id },
  });

export const updateName = (id: string, title: string) =>
  db.update({
    TableName: Table.steps.tableName,
    Key: { id },
    UpdateExpression: "set title = :title",
    ExpressionAttributeValues: { ":title": title },
  });

export const updateSteps = (id: string, steps: number[][]) =>
  db.update({
    TableName: Table.steps.tableName,
    Key: { id },
    UpdateExpression: "set steps = :steps",
    ExpressionAttributeValues: { ":steps": steps },
  });
