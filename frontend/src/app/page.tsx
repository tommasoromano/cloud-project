"use client";
import { Transactions } from "@/components/blocks/transactions";
import { Transaction, makeRandomTransaction } from "@/types/types";
import { HeroBalance } from "@/components/blocks/balance";
import { CircleX, Loader2 } from "lucide-react";
import useAuthUser from "./hooks/use-auth-user";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [user, isLoading] = useAuthUser();

  // const transactions = [
  //   makeRandomTransaction(),
  //   makeRandomTransaction(),
  //   makeRandomTransaction(),
  //   makeRandomTransaction(),
  //   makeRandomTransaction(),
  //   makeRandomTransaction(),
  //   makeRandomTransaction(),
  //   makeRandomTransaction(),
  //   makeRandomTransaction(),
  //   makeRandomTransaction(),
  // ];
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch(
      "https://z07r0dozg2.execute-api.eu-central-1.amazonaws.com/cloudprojectstage",
      { 
        method: "GET",
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET"
  }})
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          return;
        }
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);

  console.log(transactions)

  return (
    <div className="flex flex-col gap-6 items-center justify-center">
      {isLoading && <Loader2 className="w-16 h-16 animate-spin" />}
      {isLoading && (
        <h2 className="text-lg font-medium">Loading your wallet...</h2>
      )}
      {!isLoading && !user && <CircleX className="h-16 w-16 text-red-500" />}
      {!isLoading && !user && (
        <h2 className="text-lg font-medium">You are not logged in</h2>
      )}
      {!isLoading && user && <HeroBalance transactions={transactions} />}
      {!isLoading && user && <Transactions data={transactions} />}
      {/* {sectionActions} */}
    </div>
  );
}
