import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient();

export const handler = async (event, context, callback) => {
  //   if (!event.requestContext.authorizer) {
  //     console.log("Authorization not configured");
  //     return {
  //       statusCode: 401,
  //       error: true,
  //       body: JSON.stringify("Authorization not configured"),
  //       headers: {
  //         "Access-Control-Allow-Headers": "Content-Type",
  //         "Access-Control-Allow-Origin": "*",
  //         "Access-Control-Allow-Methods": "GET",
  //       },
  //     };
  //   }

  //   const username = event.requestContext.authorizer.claims["cognito:username"];
  //   console.log("username", username);

  try {
    const scanCommand = new ScanCommand({
      TableName: "transactions",
      //   FilterExpression: "userId = :userId",
      //   ExpressionAttributeNames: {
      //     ":userId": username,
      //   },
    });
    const data = await client.send(scanCommand);
    // const items = data.Items.map((item) => {
    //   const formattedItem = {};
    //   Object.keys(item).forEach((key) => {
    //     formattedItem[key] = getItemValue(item[key]);
    //   });
    //   return formattedItem;
    // });
    const items = data.Items;

    console.log("items", items);

    return {
      statusCode: 200,
      error: false,
      body: JSON.stringify(items),
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      error: true,
      body: JSON.stringify("no_items_found"),
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    };
  }
};
