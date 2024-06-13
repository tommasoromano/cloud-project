import { ArrowDownIcon, ArrowUpIcon, Cog } from "lucide-react";
import { Badge } from "../ui/badge";
import { Transaction } from "@/types/types";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import useTransactions from "@/app/hooks/use-transactions";

export const TransactionLine = ({
  t,
  myUserId,
}: {
  t: Transaction;
  myUserId: string;
}) => {
  const { postRequest } = useTransactions(undefined);
  const [processingRequest, setProcessingRequest] = useState(false);

  const onClickRequest = (id: string, approval: boolean) => {
    setProcessingRequest(true);
    postRequest(id, approval)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setProcessingRequest(true);
      })
      .catch((error) => {
        setProcessingRequest(false);
        console.error(error);
      });
  };
  return (
    <div className="w-full flex flex-col gap-2 justify-center items-center">
      <div className="w-full flex flex-row justify-between items-center py-3">
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
                <span className="font-bold">{t.sender}</span>
              ) : (
                <span className="font-bold">{t.recipient}</span>
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
      {t.transactionStatus !== "success" ? (
        t.transactionStatus === "requested" && t.sender === myUserId ? (
          processingRequest ? (
            <div className="flex items-center justify-center gap-2 pb-4">
              <Cog className="h-6 w-6 animate-spin" />
              Processing request...
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 pb-4">
              <div>Approve this transaction request</div>
              <div className="flex gap-2 justify-center items-center">
                <Button onClick={() => onClickRequest(t.id, true)} className="">
                  Accept
                </Button>
                <Button
                  onClick={() => onClickRequest(t.id, false)}
                  variant="destructive"
                  className=""
                >
                  Decline
                </Button>
              </div>
            </div>
          )
        ) : (
          <div className="text-sm mb-2">{t.statusMessage}</div>
        )
      ) : null}
    </div>
  );
};
