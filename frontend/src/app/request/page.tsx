"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CircleCheck, CircleX, Cog, Handshake, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";
import { post, isCancelError } from "@aws-amplify/api";
import useTransactions from "../hooks/use-transactions";
import useAuthUser from "../hooks/use-auth-user";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Header } from "@/components/blocks/header";

export default function SendMoney() {
  const [user, isLoadingAuth] = useAuthUser();
  const { postTransaction } = useTransactions(user);
  const router = useRouter();

  const [sent, setSent] = useState(false);
  const [data, setData] = useState<string[] | undefined>(undefined);

  async function handleSend(prevState: string | undefined, formData: FormData) {
    try {
      const _data = [
        formData.get("sender") as string,
        formData.get("amount") as string,
        formData.get("note") as string,
      ];
      await postTransaction(_data[0], parseFloat(_data[1]), _data[2], true);
      setData(_data);
      setSent(true);
    } catch (error) {
      console.error(error);
      return JSON.stringify(error);
    }
  }

  const [errorMessage, dispatch] = useFormState(handleSend, undefined);

  const form = (
    <div className="flex flex-col gap-6">
      <Header />
      <div className="rounded-lg bg-background p-6 shadow-sm">
        <h2 className="text-lg font-medium">Request Money</h2>
        <form action={dispatch} className="mt-4 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="sender">Sender</Label>
            <Input
              id="sender"
              name="sender"
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
            Request Money
          </Button>
          <div className="mt-4 text-red-500">{errorMessage}</div>
        </form>
      </div>
    </div>
  );

  const success = data && (
    <div className="rounded-lg bg-background p-6 shadow-sm flex flex-col items-center justify-center gap-4">
      {/* <Handshake className="h-16 w-16 text-foreground" /> */}
      <Cog className="h-16 w-16 text-foreground animate-spin" />
      <h2 className="text-lg font-medium">Requested correctly!</h2>
      <p className="text-center">
        You requested {parseFloat(data[1]).toFixed(2)}€ from {data[0]} for:{" "}
        {data[2]}.
        <br />
        The transaction is currently pending. It will be processed shortly.
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
        <Link href="/request">
          <Button
            className="w-full"
            onClick={() => {
              setSent(false);
              setData(undefined);
            }}
          >
            Request More Money
          </Button>
        </Link>
      </div>
    </div>
  );

  return <div className="flex flex-col gap-6">{sent ? success : form}</div>;
}
