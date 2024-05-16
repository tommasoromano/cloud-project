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
import { useFormState } from "react-dom";
import { post, isCancelError } from "@aws-amplify/api";
import useTransactions from "../hooks/use-transactions";
import useAuthUser from "../hooks/use-auth-user";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SendMoney() {
  const [user, isLoadingAuth] = useAuthUser();
  const { postTransaction } = useTransactions(user);
  const router = useRouter();

  const [sent, setSent] = useState(false);
  const [data, setData] = useState<string[] | undefined>(undefined);

  async function handleSend(prevState: string | undefined, formData: FormData) {
    try {
      const _data = [
        formData.get("recipient") as string,
        formData.get("amount") as string,
        formData.get("note") as string,
      ];
      // await postTransaction(_data[0], parseFloat(_data[1]), _data[2]);
      setData(_data);
      await axios.post(
        "https://z07r0dozg2.execute-api.eu-central-1.amazonaws.com/cloudprojectstage/transaction",
        {
          sender: user?.userId,
          recipient: _data[0],
          amount: parseFloat(_data[1]),
          note: _data[2],
        }
      );
      setSent(true);
    } catch (error) {
      if (!isCancelError(error)) {
        console.error(error);
        return "";
      }
    }
  }

  const [errorMessage, dispatch] = useFormState(handleSend, undefined);

  const form = (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg bg-background p-6 shadow-sm">
        <h2 className="text-lg font-medium">Send Money</h2>
        <form action={dispatch} className="mt-4 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              name="recipient"
              placeholder="Enter a friend's name"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              placeholder="0.00€"
              type="number"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea id="note" name="note" placeholder="Add a note" />
          </div>
          <Button className="w-full" type="submit" onClick={() => {}}>
            Send Money
          </Button>
          <div className="mt-4 text-red-500">{errorMessage}</div>
        </form>
      </div>
    </div>
  );

  // const processing = transaction && (
  //   <div className="rounded-lg bg-background p-6 shadow-sm flex flex-col items-center justify-center gap-4">
  //     <Loader2 className="h-16 w-16 animate-spin" />
  //     <h2 className="text-lg font-medium">Processing...</h2>
  //     <p className="">
  //       Sending {transaction.amount.toFixed(2)}€ to {transaction.recipient}
  //       {transaction.note ? ` for: ${transaction.note}` : ""}
  //     </p>
  //   </div>
  // );

  // const success = transaction && (
  //   <div className="rounded-lg bg-background p-6 shadow-sm flex flex-col items-center justify-center gap-4">
  //     <CircleCheck className="h-16 w-16 text-green-500" />
  //     <h2 className="text-lg font-medium">Success!</h2>
  //     <p className="">
  //       You sent {transaction.amount.toFixed(2)}€ to {transaction.recipient}
  //       {transaction.note ? ` for: ${transaction.note}` : ""}
  //     </p>
  //     <div className="flex gap-2">
  //       <Link href="/">
  //         <Button
  //           className="w-full"
  //           onClick={() => {
  //             //   setStatus("none");
  //           }}
  //         >
  //           Back to Home
  //         </Button>
  //       </Link>
  //       <Link href="/send">
  //         <Button
  //           className="w-full"
  //           onClick={() => {
  //             //   setStatus("none");
  //           }}
  //         >
  //           Send More Money
  //         </Button>
  //       </Link>
  //     </div>
  //   </div>
  // );

  // const error = transaction && (
  //   <div className="rounded-lg bg-background p-6 shadow-sm flex flex-col items-center justify-center gap-4">
  //     <CircleX className="h-16 w-16 text-red-500" />
  //     <h2 className="text-lg font-medium">Error</h2>
  //     <p className="">
  //       There was an error sending {transaction.amount.toFixed(2)}€ to{" "}
  //       {transaction.recipient}: {transaction.statusMessage}
  //     </p>
  //     <div className="flex gap-2">
  //       <Button
  //         className="w-full"
  //         onClick={() => {
  //           // setStatus("none");
  //         }}
  //       >
  //         Try Again
  //       </Button>
  //       <Link href="/">
  //         <Button
  //           className="w-full"
  //           onClick={() => {
  //             //   setStatus("none");
  //           }}
  //         >
  //           Back to Home
  //         </Button>
  //       </Link>
  //       <Link href="/send">
  //         <Button
  //           className="w-full"
  //           onClick={() => {
  //             // setStatus("none");
  //           }}
  //         >
  //           Send More Money
  //         </Button>
  //       </Link>
  //     </div>
  //   </div>
  // );

  const success = data && (
    <div className="rounded-lg bg-background p-6 shadow-sm flex flex-col items-center justify-center gap-4">
      <CircleCheck className="h-16 w-16 text-green-500" />
      <h2 className="text-lg font-medium">Sent correctly!</h2>
      <p className="">
        You sent {parseFloat(data[1]).toFixed(2)}€ to {data[0]} for: {data[2]}
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
              setSent(false);
              setData(undefined);
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
      {sent ? success : form}
      {/* {id === ""
        ? form
        : transaction && transaction.status === "pending"
        ? processing
        : transaction && transaction.status === "success"
        ? success
        : transaction && transaction.status === "failed"
        ? error
        : null} */}
    </div>
  );
}
