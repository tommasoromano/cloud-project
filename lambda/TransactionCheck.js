import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient();

export const handler = async (event) => {
  const transaction = JSON.parse(event["Records"][0]["body"]);

  const sender = transaction["sender"];
  const recipient = transaction["recipient"];
  const amount = transaction["amount"];

  try {
    // Check if sender has enough balance
    const balance = await calculateBalance(sender);

    if (balance < amount) {
      // update transaction with same id on dynamo to status to failed
      try {
        await updateTransaction(
          transaction.id,
          "failed",
          "Insufficient balance"
        );
        return {
          statusCode: 400,
          body: JSON.stringify("Insufficient balance"),
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify(
            "Error updating transaction for insufficient balance"
          ),
        };
      }
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify("Error getting data for balance"),
    };
  }

  // update the transaction with same id on dynamo to status to success
  try {
    await updateTransaction(transaction, "success", "Transaction successful");
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify("Error updating transaction to success"),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify("Transaction successful"),
  };
};

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

async function calculateBalance(userId) {
  // get from dynamo records where userId in sender or recipient
  const data = await client.send(
    new ScanCommand({
      TableName: "transactions",
      FilterExpression: "sender = :userId or recipient = :userId",
      ExpressionAttributeValues: {
        ":userId": { S: userId },
      },
    })
  );

  if (!data.Items) {
    return 0;
  }

  const balance = data.Items.reduce((acc, item) => {
    const amount = parseFloat(item.amount.N);
    if (item.recipient.S === userId) {
      return acc + amount;
    } else {
      return acc - amount;
    }
  }, 0);

  return balance;
}
