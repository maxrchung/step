import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { Table } from "sst/node/table";
import { Style, createEmptyStyle } from "./style";

const db = DynamoDBDocument.from(new DynamoDBClient({}));

interface Step {
  id: string;
  title: string;
  style: Style;
  steps: number[][];
  owner: string;
  created: string;
  updated: string;

  // Height of each step
  spacing?: number;
}

interface OwnerStep {
  id: string;
  title: string;
  owner: string;
  created: string;
}

export const createStep = (
  id: string,
  owner: string,
  title: string,
  date: string
) => {
  const item: Step = {
    id,
    owner,
    title,
    style: Style.DDR_SINGLE,
    steps: createEmptyStyle(Style.DDR_SINGLE),
    created: date,
    updated: date,
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

export const updateName = (id: string, title: string) => {
  const updated = new Date().toISOString();
  return db.update({
    TableName: Table.steps.tableName,
    Key: { id },
    UpdateExpression: "set title = :title, updated = :updated",
    ExpressionAttributeValues: { ":title": title, ":updated": updated },
  });
};

export const updateSteps = (id: string, steps: number[][]) => {
  const updated = new Date().toISOString();
  return db.update({
    TableName: Table.steps.tableName,
    Key: { id },
    UpdateExpression: "set steps = :steps, updated = :updated",
    ExpressionAttributeValues: { ":steps": steps, ":updated": updated },
  });
};

export const updateStyle = (id: string, style: Style) => {
  const updated = new Date().toISOString();
  return db.update({
    TableName: Table.steps.tableName,
    Key: { id },
    UpdateExpression: "set #style = :style, updated = :updated, steps = :steps",
    ExpressionAttributeNames: { "#style": "style" },
    ExpressionAttributeValues: {
      ":style": style,
      ":updated": updated,
      ":steps": createEmptyStyle(style),
    },
  });
};

export const updateSpacing = (id: string, spacing: number) => {
  const updated = new Date().toISOString();
  return db.update({
    TableName: Table.steps.tableName,
    Key: { id },
    UpdateExpression: "set spacing = :spacing, updated = :updated",
    ExpressionAttributeValues: {
      ":spacing": spacing,
      ":updated": updated,
    },
  });
};
