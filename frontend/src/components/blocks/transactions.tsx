import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Transaction, makeRandomTransaction, userToName } from "@/types/types";
import { useEffect, useState } from "react";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const transactionLine = (t: Transaction, i: number) => {
  return (
    <div
      key={i}
      className="w-full flex flex-row justify-between items-center py-3"
    >
      <div className="flex flex-row items-center gap-6">
        <div className="flex flex-col items-center justify-center">
          <span className="text-xs">
            {monthNames[new Date(t.timestamp).getMonth() - 1].toUpperCase()}
          </span>
          <span className="font-bold">{new Date(t.timestamp).getDay()}</span>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium">
            {t.amount >= 0 ? "Received from" : "Sent to"}{" "}
            <span className="font-bold">{userToName(t.recipient)}</span>
          </p>
          <div className="text-sm text-muted-foreground">
            {t.status === "success" ? null : t.status === "failed" ||
              t.status === "cancelled" ? (
              <Badge variant="destructive" className="text-xs">
                Failed
              </Badge>
            ) : (
              <Badge className="text-xs">Pending</Badge>
            )}{" "}
            {t.note}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {t.amount >= 0 ? (
          <p className="text-sm font-medium text-green-500">
            +{t.amount.toFixed(2)}
            {""}€
          </p>
        ) : (
          <p className="text-sm font-medium text-red-500">
            {t.amount.toFixed(2)}
            {""}€
          </p>
        )}
        {t.amount >= 0 ? (
          <ArrowUpIcon className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDownIcon className="h-4 w-4 text-red-500" />
        )}
      </div>
    </div>
  );
};

export const Transactions = ({ data }: { data: Transaction[] }) => {

  return (
    <div className="rounded-lg bg-background p-6 shadow-sm w-full">
      <h2 className="text-lg font-medium">Recent Transactions</h2>
      <div className="mt-2 divide-y">
        {data.map((t, i) => transactionLine(t, i))}
      </div>
    </div>
  );
};
