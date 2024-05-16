export type TransactionStatus = "pending" | "success" | "failed" | "cancelled";

export interface Transaction {
  id: string;
  sender: string;
  recipient: string;
  timestamp: number;
  amount: number;
  status: TransactionStatus;
  note: string;
  statusMessage: string;
}

export const calculateBalance = (transactions: Transaction[], userId: string) =>
  transactions.length === 0
    ? 0
    : transactions
        .filter((t) => t.recipient === userId || t.sender === userId)
        .map((t) =>
          t.status === "success"
            ? t.recipient !== userId && t.sender === userId
              ? -t.amount
              : t.amount
            : 0
        )
        .reduce((p, c) => p + c);

export const makeRandomTransaction = () => {
  const id = Math.random().toString(36).substring(2, 10);
  const users = ["John", "Jane", "Alex", "Emily"];
  const user = users[Math.floor(Math.random() * users.length)];
  const date = new Date(
    2023,
    Math.floor(Math.random() * 10) + 1,
    Math.floor(Math.random() * 10) + 1
  ).getTime();
  const amount = Math.floor(Math.random() * 10000) / 100 - 30;
  const status = [
    "pending",
    "success",
    "success",
    "success",
    "failed",
    "cancelled",
  ][Math.floor(Math.random() * 5)];
  const note = ["Pizza 🍕", "Dinner 🍝", "Groceries 🍒", "Rent 🏠"][
    Math.floor(Math.random() * 4)
  ];
  return {
    id,
    sender: "Tommaso",
    recipient: user,
    timestamp: date,
    amount,
    status,
    note,
    statusMessage: "",
  } as Transaction;
};

export const userToName = (userId: string) => {
  const users: { [key: string]: string } = {
    "83b43852-80d1-7042-d716-e36dfe409b14": "Alice",
    "9374f852-40b1-705e-abd1-707970ccb270": "Bob",
  };
  if (Object.keys(users).includes(userId)) {
    return users[userId];
  }
  return "Charlie";
};

export const nameToUser = (name: string) => {
  const users: { [key: string]: string } = {
    Alice: "83b43852-80d1-7042-d716-e36dfe409b14",
    Bob: "9374f852-40b1-705e-abd1-707970ccb270",
  };
  if (Object.keys(users).includes(name)) {
    return users[name];
  }
  return "Charlie";
};
