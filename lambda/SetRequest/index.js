"use strict";

const AWSDynamoDB = require("@aws-sdk/client-dynamodb");
const DynamoDBClient = AWSDynamoDB.DynamoDBClient;
const UpdateItemCommand = AWSDynamoDB.UpdateItemCommand;
const ScanCommand = AWSDynamoDB.ScanCommand;
const client = new DynamoDBClient();

const AWSSQS = require("@aws-sdk/client-sqs");
const SQSClient = AWSSQS.SQSClient;
const SendMessageCommand = AWSSQS.SendMessageCommand;
const sqsClient = new SQSClient({ region: "eu-central-1" });

export const handler = async (event) => {
  let [approval, id] = ["", ""];

  // Get the approval and id from the body
  try {
    // const eventParams = ["approval", "id"];
    // [approval, id] = eventParams.map((param) => JSON.parse(event.body)[param]);
    approval = event.approval;
    id = event.id;
  } catch (error) {
    return respond.error("Invalid body or json");
  }

  // Get the transaction from the database
  let transaction = {};

  try {
    transaction = await findTransaction(id);
  } catch (error) {
    return respond.error("Error while finding transaction");
  }

  if (transaction.transactionStatus !== "requested") {
    return respond.error("Transaction is not in requested status");
  }

  // Update the transaction status
  try {
    await updateTransaction(
      id,
      approval ? "pending" : "cancelled",
      approval
        ? "Transaction is approved"
        : "Transaction request has been rejected"
    );
  } catch (error) {
    return respond.error("Error while updating transaction");
  }

  if (!approval) {
    return respond.success(
      JSON.stringify({
        message: "Transaction canceled",
        transaction: transaction,
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
    MessageBody: JSON.stringify(transaction),
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
          transaction: transaction,
        })
      );
    } else {
      return respond.error("Error sending message to SQS");
    }
  } catch (err) {
    return respond.error("Error sending message to SQS");
  }
};

async function findTransaction(id) {
  const transactions = await client.send(
    new ScanCommand({
      TableName: "transactions",
      FilterExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": { S: id },
      },
    })
  );

  if (transactions.Items.length === 0) {
    return null;
  }

  return {
    id: transactions.Items[0].id.S,
    sender: transactions.Items[0].sender.S,
    recipient: transactions.Items[0].recipient.S,
    amount: transactions.Items[0].amount.N,
    note: transactions.Items[0].note.S,
    timestamp: transactions.Items[0].timestamp.S,
    transactionStatus: transactions.Items[0].transactionStatus.S,
    statusMessage: transactions.Items[0].statusMessage.S,
  };
}

const updateTransaction = async (id, transactionStatus, statusMessage) => {
  const paramsDynamo = {
    TableName: "transactions",
    Key: {
      id: { S: id },
    },
    UpdateExpression:
      "SET transactionStatus = :transactionStatus, statusMessage = :statusMessage",
    ExpressionAttributeValues: {
      ":transactionStatus": { S: transactionStatus },
      ":statusMessage": { S: statusMessage },
    },
  };

  const command = new UpdateItemCommand(paramsDynamo);

  return client.send(command);
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
