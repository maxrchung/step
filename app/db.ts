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
}

export const createStep = async (id: string, owner: string) => {
  const item: Step = {
    id,
    owner,
    title: "My Step",
    style: Style.DDR_SINGLE,
    steps: [],
  };

  return await db.put({
    TableName: Table.steps.tableName,
    Item: item,
  });
};

export const getStep = async (id: string) => {
  return await db.get({
    TableName: Table.steps.tableName,
    Key: {
      id,
    },
  });
};
