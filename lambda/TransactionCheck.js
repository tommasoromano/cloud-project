import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new DynamoDBClient();
const cognito = new CognitoIdentityProviderClient();

export const handler = async (event) => {
  const transaction = JSON.parse(event["Records"][0]["body"]);

  let sender = transaction["sender"];
  let recipient = transaction["recipient"];
  const amount = transaction["amount"];

  /*
   * ---------------------
   * Check if sender exists
   * ---------------------
   * */

  try {
    sender = await emailToUserid(sender);
    if (!sender) {
      await updateTransaction(
        transaction.id,
        "failed",
        "Sender does not exist"
      );
      return {
        statusCode: 400,
        body: JSON.stringify("Sender does not exist"),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify("Error while checking sender existence"),
    };
  }

  /*
   * ---------------------
   * Check if recipient exists
   * ---------------------
   * */

  try {
    recipient = await emailToUserid(recipient);
    if (!recipient) {
      await updateTransaction(
        transaction.id,
        "failed",
        "Recipient does not exist"
      );
      console.log("Recipient does not exist");
      return {
        statusCode: 400,
        body: JSON.stringify("Recipient does not exist"),
      };
    }
    await updateRecipient(transaction.id, recipient);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify("Error while checking recipient existence"),
    };
  }

  /*
   * ---------------------
   * Check if sender and recipient are the same
   * ---------------------
   * */

  if (sender === recipient) {
    try {
      await updateTransaction(
        transaction.id,
        "failed",
        "Sender and recipient are the same"
      );
      return {
        statusCode: 400,
        body: JSON.stringify("Sender and recipient are the same"),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify("Error updating transaction for same sender"),
      };
    }
  }

  /*
   * ---------------------
   * Check if balance is enough
   * ---------------------
   * */

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

  /*
   * ---------------------
   * Update transaction status to success
   * ---------------------
   * */

  try {
    await updateTransaction(
      transaction.id,
      "success",
      "Transaction successful"
    );
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

/*
 * ---------------------
 * Utility functions
 * ---------------------
 * */

const updateRecipient = async (id, recipient) => {
  const paramsDynamo = {
    TableName: "transactions",
    Key: {
      id: { S: id },
    },
    UpdateExpression: "SET recipient = :recipient",
    ExpressionAttributeValues: {
      ":recipient": { S: recipient },
    },
  };

  const command = new UpdateItemCommand(paramsDynamo);

  return client.send(command);
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
    if (item.transactionStatus.S !== "success") {
      return acc;
    }
    if (item.recipient.S === userId) {
      return acc + amount;
    } else {
      return acc - amount;
    }
  }, 0);

  return balance;
}

async function emailToUserid(email) {
  const paramsCognito = {
    UserPoolId: "eu-central-1_8RUoTeJVb",
    Filter: `email = "${email}"`,
  };

  const command = new ListUsersCommand(paramsCognito);
  const users = await cognito.send(command);

  return users.Users.length > 0 ? users.Users[0].Username : null;
}
