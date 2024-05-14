"use client";
import { Transactions } from "@/components/blocks/transactions";
import { Transaction, makeRandomTransaction } from "@/types/types";
import { HeroBalance } from "@/components/blocks/balance";
import { CircleX, Loader2 } from "lucide-react";
import useAuthUser from "./hooks/use-auth-user";
import { get, isCancelError } from '@aws-amplify/api';
import { useState, useEffect } from "react";

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
  const [data, setData] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const { body } = await get({
        apiName: "cloud-project-api-rest",
        path: "/transaction",
        // options: {
        //   headers, // Optional, A map of custom header key/values
        //   body, // Optional, JSON object or FormData
        //   queryParams, // Optional, A map of query strings
        // }
      }).response;
      return await body.json();
    }
    fetchData().then((res) => {
      // setTransactions(data);
      console.log(res);
      setData(res as any);
      setLoading(false);
    }).catch((error) => {
      if (!isCancelError(error)) {
        console.error(error);
        setLoading(false);
      }
    }
    );
    
    // fetch(
    //   "https://z07r0dozg2.execute-api.eu-central-1.amazonaws.com/cloudprojectstage/transaction",
    // ).then((response) => 
    //   {
    //     console.log(response);
    //     return response.json()})
    
  }, []);

  console.log(transactions);

  return (
    <div className="flex flex-col gap-6 items-center justify-center">
    {JSON.stringify(data)}
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
