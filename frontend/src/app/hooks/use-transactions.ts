import { Transaction, nameToUser } from "@/types/types";
import { useState, useEffect, use } from "react";
import useAuthUser, { User } from "./use-auth-user";
import { get, post, isCancelError } from "@aws-amplify/api";

export default function useTransactions(user: User) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = () => {
    setLoading(true);
    const fetchData = async () => {
      const { body } = await get({
        apiName: "cloud-project-api-rest",
        path: "/transaction",
      }).response;
      return await body.json();
    };
    fetchData()
      .then((res) => {
        const data = (JSON.parse((res as any)["body"]) as any[]).map(
          (t) =>
            ({
              id: t.id,
              sender: t.sender,
              recipient: t.recipient,
              timestamp: t.timestamp,
              amount: t.amount,
              status: t.status,
              note: t.note,
              statusMessage: t.statusMessage,
            } as Transaction)
        ) as Transaction[];
        console.log(data);
        setTransactions(data);
        setLoading(false);
      })
      .catch((error) => {
        if (!isCancelError(error)) {
          console.error(error);
          setLoading(false);
        }
      });
  };

  return {
    isLoading: loading,
    transactions: transactions
      .filter((t) => t.sender === user?.userId || t.recipient === user?.userId)
      .sort((a, b) => b.timestamp - a.timestamp),
    fetchTransactions: () => fetchTransactions(),
    postTransaction: async (
      recipient: string,
      amount: number,
      note: string
    ) => {
      // const randomString = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
      const params: { [key: string]: string } = {
        // id: randomString,
        userId: JSON.stringify(user?.userId),
        recipient: nameToUser(recipient),
        amount: JSON.stringify(amount),
        note: note,
      };
      const formData = new FormData();
      Object.keys(params).forEach((key) => formData.append(key, params[key]));
      const { body } = await get({
        apiName: "cloud-project-api-rest",
        path: "/start-transaction",
        options: {
          body: formData,
        },
      }).response;
      return await body.json();
    },
  };
}
