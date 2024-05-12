"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Transaction,
  TransactionStatus,
  makeRandomTransaction,
} from "@/types/types";
import { CircleCheck, CircleX, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SendMoney() {
  const [status, setStatus] = useState<TransactionStatus | "none">("none");
  const transaction = makeRandomTransaction();

  const form = (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg bg-background p-6 shadow-sm">
        <h2 className="text-lg font-medium">Send Money</h2>
        <form className="mt-4 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="recipient">Recipient</Label>
            <Input id="recipient" placeholder="Enter a friend's name" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" placeholder="0.00€" type="number" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea id="note" placeholder="Add a note" />
          </div>
          <Button
            className="w-full"
            type="submit"
            onClick={() => {
              setStatus(
                ["pending", "success", "failed"][
                  Math.floor(Math.random() * 3)
                ] as TransactionStatus
              );
            }}
          >
            Send Money
          </Button>
        </form>
      </div>
    </div>
  );

  const processing = (
    <div className="rounded-lg bg-background p-6 shadow-sm flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-16 w-16 animate-spin" />
      <h2 className="text-lg font-medium">Processing...</h2>
      <p className="">
        Sending {transaction.amount.toFixed(2)}€ to {transaction.recipient}
        {transaction.note ? ` for: ${transaction.note}` : ""}
      </p>
    </div>
  );

  const success = (
    <div className="rounded-lg bg-background p-6 shadow-sm flex flex-col items-center justify-center gap-4">
      <CircleCheck className="h-16 w-16 text-green-500" />
      <h2 className="text-lg font-medium">Success!</h2>
      <p className="">
        You sent {transaction.amount.toFixed(2)}€ to {transaction.recipient}
        {transaction.note ? ` for: ${transaction.note}` : ""}
      </p>
      <div className="flex gap-2">
        <Link href="/">
          <Button
            className="w-full"
            onClick={() => {
              //   setStatus("none");
            }}
          >
            Back to Home
          </Button>
        </Link>
        <Link href="/send">
          <Button
            className="w-full"
            onClick={() => {
              //   setStatus("none");
            }}
          >
            Send More Money
          </Button>
        </Link>
      </div>
    </div>
  );

  const error = (
    <div className="rounded-lg bg-background p-6 shadow-sm flex flex-col items-center justify-center gap-4">
      <CircleX className="h-16 w-16 text-red-500" />
      <h2 className="text-lg font-medium">Error</h2>
      <p className="">
        There was an error sending {transaction.amount.toFixed(2)}€ to{" "}
        {transaction.recipient}
        {transaction.note ? ` for: ${transaction.note}` : ""}
      </p>
      <div className="flex gap-2">
        <Button
          className="w-full"
          onClick={() => {
            // setStatus("none");
          }}
        >
          Try Again
        </Button>
        <Link href="/">
          <Button
            className="w-full"
            onClick={() => {
              //   setStatus("none");
            }}
          >
            Back to Home
          </Button>
        </Link>
        <Link href="/send">
          <Button
            className="w-full"
            onClick={() => {
              setStatus("none");
            }}
          >
            Send More Money
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {status === "none"
        ? form
        : status === "pending"
        ? processing
        : status === "success"
        ? success
        : status === "failed"
        ? error
        : null}
    </div>
  );
}
