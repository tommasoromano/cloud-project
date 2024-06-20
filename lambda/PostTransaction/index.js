"use strict";

const AWSDynamoDB = require("@aws-sdk/client-dynamodb");
const DynamoDBClient = AWSDynamoDB.DynamoDBClient;
const PutItemCommand = AWSDynamoDB.PutItemCommand;
const dynamoDBClient = new DynamoDBClient();

const AWSSQS = require("@aws-sdk/client-sqs");
const SQSClient = AWSSQS.SQSClient;
const SendMessageCommand = AWSSQS.SendMessageCommand;
const sqsClient = new SQSClient({ region: "eu-central-1" });

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
    return respond.error("Invalid body or json");
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
    return respond.error("Error adding record to DynamoDB");
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
    return respond.success(
      JSON.stringify({
        message: "Transaction requested",
        transaction: dataSQS,
      })
    );
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
      return respond.success(
        JSON.stringify({
          message: "Message Sent to SQS - MessageId: " + data.MessageId,
          transaction: dataSQS,
        })
      );
    } else {
      return respond.error("Error sending message to SQS");
    }
  } catch (err) {
    return respond.error("Error sending message to SQS");
  }
};

const respond = {
  success: (data) => {
    return {
      statusCode: 200,
      body: data,
      headers: headers,
      isBase64Encoded: false,
    };
  },
  error: (message) => {
    return {
      statusCode: 500,
      body: message,
      headers: headers,
      isBase64Encoded: false,
    };
  },
  notFound: (message) => {
    return {
      statusCode: 404,
      body: message,
      headers: headers,
      isBase64Encoded: false,
    };
  },
};

const headers = {
  // "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  // "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
};
