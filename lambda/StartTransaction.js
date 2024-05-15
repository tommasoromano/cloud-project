import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
const sqsClient = new SQSClient({ region: "eu-central-1" });

import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import

const dynamoDBClient = new DynamoDBClient();

export const handler = async (event) => {
  let response;
  let dataSQS;

  // check if body is empty
  if (!event.body) {
    response = {
      statusCode: 400,
      body: JSON.stringify({ message: "missing_information" }),
    };
    return response;
  }

  // check if body is valid JSON
  try {
    JSON.parse(event.body);
  } catch (error) {
    response = {
      statusCode: 400,
      body: JSON.stringify({ message: "invalid_json" }),
    };
    return response;
  }

  // check if body contains all required parameters
  const eventParams = ["sender", "recipient", "amount", "note"];
  for (let i = 0; i < eventParams.length; i++) {
    if (!JSON.parse(event.body)[eventParams[i]]) {
      response = {
        statusCode: 400,
        body: JSON.stringify({ message: "missing_" + eventParams[i] }),
      };
      return response;
    }
  }

  const [sender, recipient, amount, note] = eventParams.map(
    (param) => JSON.parse(event.body)[param]
  );
  const id =
    Math.random().toString(36).substring(2, 10) +
    Math.random().toString(36).substring(2, 10) +
    Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now();
  const status = "pending";
  const statusMessage = "Transaction is pending";

  const paramsDynamo = {
    TableName: "transactions",
    Item: {
      id: { S: id },
      sender: { S: sender },
      recipient: { S: recipient },
      amount: { N: parseFloat(amount).toString() },
      note: { S: note },
      timestamp: { N: timestamp.toString() },
      status: { S: status },
      statusMessage: { S: statusMessage },
    },
  };

  const command = new PutItemCommand(paramsDynamo);

  try {
    const res = await dynamoDBClient.send(command);
    console.log(res);
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify("Error adding record"),
    };
  }

  return {
    statusCode: 200,
    error: false,
    body: JSON.stringify({
      id,
      sender,
      recipient,
      amount,
      note,
      timestamp,
      status,
      statusMessage,
    }),
    headers: {
      // "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Methods": "POST",
    },
  };

  // dataSQS = JSON.parse(event.body)
  // dataSQS.orderId = randomString

  // const params = {
  //     DelaySeconds: 0,
  //     MessageAttributes: {
  //         Author: {
  //             DataType: "String",
  //             StringValue: "Preeti",
  //         }
  //     },
  //     MessageBody: JSON.stringify(dataSQS),
  //     MessageGroupId: randomString,
  //     FifoQueue: true,
  //     MessageDeduplicationId: randomString,
  //     MessageRetentionPeriod: 345600,
  //     QueueUrl: "https://sqs.eu-central-1.amazonaws.com/495456954059/OrdersQueueFIFO.fifo"
  // };

  // // Send the order to SQS
  // try {
  //     const data = await sqsClient.send(new SendMessageCommand(params));
  //     if (data) {
  //         console.log("Success, message sent. MessageID:", data.MessageId);
  //         const bodyMessage = {
  //             message: 'Message Send to SQS - MessageId: ' + data.MessageId,
  //             orderId: randomString,
  //             callbackUrl: "wss://wkr7p95088.execute-api.eu-central-1.amazonaws.com/production/"
  //         }

  //         response = {
  //             headers: {
  //                 "Access-Control-Allow-Headers": "Content-Type",
  //                 "Access-Control-Allow-Origin": "*",
  //                 "Access-Control-Allow-Methods": "POST"
  //             },

  //             statusCode: 200,
  //             body: JSON.stringify(bodyMessage),
  //         };
  //     }
  //     else {
  //         response = {
  //             statusCode: 500,
  //             body: JSON.stringify({ "message": "error_sending_message_to_SQS" }),
  //         };
  //     }
  //     return response;
  // }
  // catch (err) {
  //     console.log("Error", err);
  // }
};
