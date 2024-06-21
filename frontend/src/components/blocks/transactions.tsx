import { ArrowDownIcon, ArrowUpIcon, Cog } from "lucide-react";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import useTransactions from "@/app/hooks/use-transactions";
import { TransactionLine } from "./transaction-line";
import { Transaction } from "@/generated/transaction";

export const Transactions = ({
  data,
  myUserId,
}: {
  data: Transaction[];
  myUserId: string;
}) => {
  return (
    <div className="rounded-lg bg-background p-6 shadow-sm w-full">
      <h2 className="text-lg font-medium">Recent Transactions</h2>
      <div className="mt-2 divide-y">
        {data.map((t, i) => (
          <TransactionLine t={t} myUserId={myUserId} key={i} />
        ))}
      </div>
    </div>
  );
};
