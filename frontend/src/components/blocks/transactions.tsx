import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Transaction } from "@/types/types";
import { useEffect, useState } from "react";

const transactionLine = (
  t: Transaction,
  i: number,
  myUserId: string,
  selected: string,
  onClick: (id: string) => void
) => {
  return (
    <div
      key={i}
      className="w-full flex flex-col gap-2 justify-center items-center"
    >
      <div
        className="w-full flex flex-row justify-between items-center py-3"
        onClick={() => onClick(selected === t.id ? "" : t.id)}
      >
        <div className="flex flex-row items-center gap-6">
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs">
              {/* {monthNames[new Date(t.timestamp).getMonth()].toUpperCase()} */}
              {new Date(t.timestamp)
                .toLocaleString("default", {
                  month: "short",
                })
                .toUpperCase()}
            </span>
            <span className="font-bold">{new Date(t.timestamp).getDate()}</span>
          </div>
          <div className="flex flex-col">
            <div className="text-sm font-medium">
              {t.sender === t.recipient
                ? null
                : myUserId === t.recipient
                ? "Received from"
                : "Sent to"}{" "}
              {t.sender === t.recipient ? null : myUserId === t.recipient ? (
                <span className="font-bold">{t.sender.split("@")[0]}</span>
              ) : (
                <span className="font-bold">{t.recipient.split("@")[0]}</span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">{t.note}</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end justify-center">
          {t.transactionStatus === "success" && (
            <div className="flex items-center gap-2">
              {myUserId === t.recipient ? (
                <p className="text-sm font-medium text-green-500">
                  +{t.amount.toFixed(2)} €
                </p>
              ) : (
                <p className="text-sm font-medium text-red-500">
                  -{t.amount.toFixed(2)} €
                </p>
              )}
              {myUserId === t.recipient ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500" />
              )}
            </div>
          )}
          {t.transactionStatus !== "success" && (
            <div className="flex items-center gap-2 text-muted-foreground">
              {myUserId === t.recipient ? (
                <p className="text-sm font-medium">+{t.amount.toFixed(2)} €</p>
              ) : (
                <p className="text-sm font-medium">-{t.amount.toFixed(2)} €</p>
              )}
              {myUserId === t.recipient ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : (
                <ArrowDownIcon className="h-4 w-4" />
              )}
            </div>
          )}
          {t.transactionStatus === "success" ? null : t.transactionStatus ===
              "failed" || t.transactionStatus === "cancelled" ? (
            <Badge variant="destructive" className="text-xs">
              Failed
            </Badge>
          ) : (
            <Badge className="text-xs">Pending</Badge>
          )}
        </div>
      </div>
      {selected === t.id && (
        <div className="text-sm mb-2">Status: {t.statusMessage}</div>
      )}
    </div>
  );
};

export const Transactions = ({
  data,
  myUserId,
}: {
  data: Transaction[];
  myUserId: string;
}) => {
  const [selected, setSelected] = useState<string>("");
  return (
    <div className="rounded-lg bg-background p-6 shadow-sm w-full">
      <h2 className="text-lg font-medium">Recent Transactions</h2>
      <div className="mt-2 divide-y">
        {data.map((t, i) =>
          transactionLine(t, i, myUserId, selected, (id) => setSelected(id))
        )}
      </div>
    </div>
  );
};
