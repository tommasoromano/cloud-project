import { Transaction } from "@/generated/transaction";
import { useState, useEffect, use } from "react";
import useAuthUser, { User } from "./use-auth-user";
import { get, post, isCancelError } from "@aws-amplify/api";
import axios from "axios";

export default function useTransactions(user: User) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = (user: User) => {
    setLoading(true);
    fetch(String(process.env.NEXT_PUBLIC_REST_API_ENDPOINT) + "/transaction")
      .then((res) => res.json())
      .then((res) => {
        const data = JSON.parse(res["body"] as string) as Transaction[];
        setTransactions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return {
    isLoading: loading,
    transactions: transactions
      .filter((t) => t.sender === user?.email || t.recipient === user?.email)
      .sort((a, b) => b.timestamp - a.timestamp),
    fetchTransactions: (user: User) => fetchTransactions(user),
    postTransaction: async (
      recipient: string,
      amount: number,
      note: string,
      request: boolean = false
    ) => {
      return await fetch(
        String(process.env.NEXT_PUBLIC_REST_API_ENDPOINT) + "/transaction",
        {
          method: "POST",
          body: JSON.stringify({
            sender: request ? recipient : (user?.email as string),
            recipient: request ? (user?.email as string) : recipient,
            amount: JSON.stringify(amount),
            note: note,
            transactionStatus: request ? "requested" : "pending",
          }),
        }
      );
    },
    postRequest: async (transactionId: string, approval: boolean) => {
      return await fetch(
        String(process.env.NEXT_PUBLIC_REST_API_ENDPOINT) + "/request",
        {
          method: "POST",
          body: JSON.stringify({
            id: transactionId,
            approval: approval,
          }),
        }
      );
    },
  };
}
