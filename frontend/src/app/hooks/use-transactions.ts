import { Transaction } from "@/types/types";
import { useState, useEffect, use } from "react";
import useAuthUser, { User } from "./use-auth-user";
import { get, post, isCancelError } from "@aws-amplify/api";
import axios from "axios";

export default function useTransactions(user: User) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = () => {
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
    fetchTransactions: () => fetchTransactions(),
    postTransaction: async (
      recipient: string,
      amount: number,
      note: string
    ) => {
      return await fetch(
        String(process.env.NEXT_PUBLIC_REST_API_ENDPOINT) + "/transaction",
        {
          method: "POST",
          body: JSON.stringify({
            sender: user?.userId as string,
            recipient: recipient,
            amount: JSON.stringify(amount),
            note: note,
          }),
        }
      );
    },
  };
}
