"use client";
import { Transactions } from "@/components/blocks/transactions";
import { makeRandomTransaction } from "@/types/types";
import { HeroBalance } from "@/components/blocks/balance";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { CircleX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  // if (error) {
  //   router.push("/api/auth/login");
  //   return <div>{error.message}</div>;
  // }

  const transactions = [
    makeRandomTransaction(),
    makeRandomTransaction(),
    makeRandomTransaction(),
    makeRandomTransaction(),
    makeRandomTransaction(),
    makeRandomTransaction(),
    makeRandomTransaction(),
    makeRandomTransaction(),
    makeRandomTransaction(),
    makeRandomTransaction(),
  ];

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
      {!isLoading && !user && (
        <Button onClick={() => router.push("/api/auth/login")}>Login</Button>
      )}
      {!isLoading && user && (
        <HeroBalance transactions={transactions} user="Tommaso" />
      )}
      {!isLoading && user && <Transactions data={transactions} />}
      {/* {sectionActions} */}
    </div>
  );
}
