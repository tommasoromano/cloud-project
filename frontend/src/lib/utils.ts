import {
  Transaction,
  Transaction_TransactionStatus,
} from "@/generated/transaction";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateBalance = (
  transactions: Transaction[],
  userId: string
) => {
  const ts = transactions
    .filter((t) => t.recipient === userId || t.sender === userId)
    .map((t) =>
      t.transactionStatus === Transaction_TransactionStatus.success
        ? t.recipient !== userId && t.sender === userId
          ? -t.amount
          : t.amount
        : 0
    );
  if (ts.length === 0) {
    return 0;
  } else {
    return ts.reduce((p, c) => p + c);
  }
};
