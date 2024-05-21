import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
const sqsClient = new SQSClient({ region: "eu-central-1" });

import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import

const dynamoDBClient = new DynamoDBClient();

export const handler = async (event) => {
  let [sender, recipient, amount, note] = ["", "", "", ""];
  try {
    [sender, recipient, amount, note] = eventParams.map(
      (param) => JSON.parse(event.body)[param]
    );
  } catch (error) {
    return returnErrorParams("Invalid json");
  }

  const id =
    Math.random().toString(36).substring(2, 10) +
    Math.random().toString(36).substring(2, 10) +
    Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now();
  const transactionStatus = "requested";
  const statusMessage = "Transaction is waiting for user approval";

  const paramsDynamo = {
    TableName: "transactions",
    Item: {
      id: { S: id },
      sender: { S: sender },
      recipient: { S: recipient },
      amount: { N: parseFloat(amount).toString() },
      note: { S: note },
      timestamp: { N: timestamp.toString() },
      transactionStatus: { S: transactionStatus },
      statusMessage: { S: statusMessage },
    },
  };

  const command = new PutItemCommand(paramsDynamo);

  try {
    const res = await dynamoDBClient.send(command);
  } catch (error) {
    return returnError("Error adding record to DynamoDB");
  }

  return {
    statusCode: 200,
    error: false,
    body: JSON.stringify(dataSQS),
    headers: headers,
  };
};

const headers = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
};

const returnErrorParams = (message) => {
  return {
    statusCode: 400,
    body: JSON.stringify({ message: message }),
    headers: headers,
  };
};

const returnError = (message) => {
  return {
    statusCode: 500,
    body: JSON.stringify({ message: message }),
    headers: headers,
  };
};
