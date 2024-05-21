import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
const sqsClient = new SQSClient({ region: "eu-central-1" });

import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import

const dynamoDBClient = new DynamoDBClient();

export const handler = async (event) => {
  let [sender, recipient, amount, note, transactionStatus] = [
    "",
    "",
    "",
    "",
    "",
  ];

  try {
    const eventParams = [
      "sender",
      "recipient",
      "amount",
      "note",
      "transactionStatus",
    ];
    [sender, recipient, amount, note, transactionStatus] = eventParams.map(
      (param) => JSON.parse(event.body)[param]
    );
  } catch (error) {
    return returnErrorParams("Invalid body or json");
  }

  const id =
    Math.random().toString(36).substring(2, 10) +
    Math.random().toString(36).substring(2, 10) +
    Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now();
  const statusMessage =
    transactionStatus === "pending"
      ? "Transaction is pending"
      : "Waiting sender approval";

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

  const dataSQS = {
    id: id,
    sender: sender,
    recipient: recipient,
    amount: amount,
    note: note,
    timestamp: timestamp,
    transactionStatus: transactionStatus,
    statusMessage: statusMessage,
  };

  if (transactionStatus === "requested") {
    return {
      statusCode: 200,
      error: false,
      body: JSON.stringify({
        message: "Transaction requested",
        transaction: dataSQS,
      }),
      headers: headers,
    };
  }

  const params = {
    DelaySeconds: 0,
    MessageAttributes: {
      Author: {
        DataType: "String",
        StringValue: "Preeti",
      },
    },
    MessageBody: JSON.stringify(dataSQS),
    MessageGroupId: id,
    FifoQueue: true,
    MessageDeduplicationId: id,
    MessageRetentionPeriod: 345600,
    QueueUrl:
      "https://sqs.eu-central-1.amazonaws.com/986423401370/cloud-project.fifo",
  };

  // Send to SQS
  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
    if (data) {
      return {
        statusCode: 200,
        error: false,
        body: JSON.stringify({
          message: "Message Sent to SQS - MessageId: " + data.MessageId,
          transaction: dataSQS,
        }),
        headers: headers,
      };
    } else {
      return returnError("Error sending message to SQS");
    }
  } catch (err) {
    return returnError("Error sending message to SQS");
  }
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
