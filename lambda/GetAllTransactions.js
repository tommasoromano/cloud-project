import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient();

function getItemValue(attribute) {
  const dataType = Object.keys(attribute)[0];
  const value = attribute[dataType];

  switch (dataType) {
    case "N":
      return parseFloat(value);
    case "S":
      return value;
    case "BOOL":
      return value === "true";
    // Handle other data types as needed
    default:
      return null;
  }
}

export const handler = async (event, context, callback) => {
  try {
    const data = await client.send(
      new ScanCommand({
        TableName: "transactions",
      })
    );

    if (!data.Items) {
      return {
        statusCode: 404,
        body: JSON.stringify("no_items_found"),
        headers: {
          // "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          // "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Credentials" : "true",
          // "Content-Type": "application/json"
        },
      };
    }

    const items = data.Items.map((item) => {
      const formattedItem = {};
      Object.keys(item).forEach((key) => {
        formattedItem[key] = getItemValue(item[key]);
      });
      return formattedItem;
    });

    return {
      statusCode: 200,
      error: false,
      body: JSON.stringify(items),
      headers: {
        // "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Credentials" : "true",
        // "Content-Type": "application/json"
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      error: true,
      body: JSON.stringify("no_items_found"),
      headers: {
        // "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Credentials" : "true",
        // "Content-Type": "application/json"
      },
    };
  }
};
