
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient();

export const handler = async (event, context, callback) => {

  try {
    const data = await client.send(new ScanCommand({
      TableName: "transactions",
    }));
    return { body: JSON.stringify(data) }
  } catch (error) {
    console.log(error);
    return { error: error };
  }
  
};
