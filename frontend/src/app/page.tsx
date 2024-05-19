"use client";
import { Transactions } from "@/components/blocks/transactions";
import { Transaction, makeRandomTransaction } from "@/types/types";
import { HeroBalance } from "@/components/blocks/balance";
import { CircleX, Loader2 } from "lucide-react";
import useAuthUser from "./hooks/use-auth-user";
import { get, isCancelError } from "@aws-amplify/api";
import { useState, useEffect } from "react";
import useTransactions from "./hooks/use-transactions";
import { Header } from "@/components/blocks/header";

export default function Home() {
  const [user, isLoadingAuth] = useAuthUser();
  const { isLoading, transactions, fetchTransactions } = useTransactions(user);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const loading = isLoadingAuth || isLoading;

  return (
    <div className="flex flex-col gap-6 items-center justify-center">
      <Header />
      {loading && <Loader2 className="w-16 h-16 animate-spin" />}
      {loading && (
        <h2 className="text-lg font-medium">Loading your wallet...</h2>
      )}
      {!loading && !user && <CircleX className="h-16 w-16 text-red-500" />}
      {!loading && !user && (
        <h2 className="text-lg font-medium">You are not logged in</h2>
      )}
      {!loading && user && <HeroBalance transactions={transactions} />}
      {!loading && user && (
        <Transactions data={transactions} myUserId={user.userId} />
      )}
      {/* {sectionActions} */}
    </div>
  );
}
