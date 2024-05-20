import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient();
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
const cognito = new CognitoIdentityProviderClient();

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
        headers: headers,
      };
    }

    const items = data.Items.map((item) => {
      const formattedItem = {};
      Object.keys(item).forEach((key) => {
        formattedItem[key] = getItemValue(item[key]);
      });
      return formattedItem;
    });

    // get all userIds from items sender and recipient
    const userIds = items.reduce((acc, item) => {
      if (!acc.includes(item.sender)) {
        acc.push(item.sender);
      }
      if (!acc.includes(item.recipient)) {
        acc.push(item.recipient);
      }
      return acc;
    }, []);

    // get all user emails from cognito
    const users = await Promise.all(
      userIds.map(async (userId) => {
        const paramsCognito = {
          UserPoolId: "eu-central-1_8RUoTeJVb",
          Filter: `username = "${userId}"`,
        };

        const command = new ListUsersCommand(paramsCognito);
        const users = await cognito.send(command);

        if (!users.Users || users.Users.length === 0) {
          return [userId, null];
        }

        return [
          userId,
          users.Users[0].Attributes.filter((a) => a.Name === "email")[0].Value,
        ];
      })
    );

    // map items sender and recipient to user emails
    items.forEach((item) => {
      const sender = users.find((user) => user[0] === item.sender);
      const recipient = users.find((user) => user[0] === item.recipient);

      item.sender = sender
        ? sender[1]
          ? sender[1]
          : item.sender
        : item.sender;
      item.recipient = recipient
        ? recipient[1]
          ? recipient[1]
          : item.recipient
        : item.recipient;
    });

    return {
      statusCode: 200,
      error: false,
      body: JSON.stringify(items),
      headers: headers,
    };
  } catch (error) {
    return {
      statusCode: 500,
      error: true,
      body: JSON.stringify("no_items_found"),
      headers: headers,
    };
  }
};

const headers = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
};
