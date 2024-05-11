import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

export default function Home() {
  const sectionBalance = (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Your Balance</h2>
          <p className="text-3xl font-bold">$2,546.78</p>
        </div>
        <Button size="sm" variant="outline">
          Add Funds
        </Button>
      </div>
    </div>
  );

  const transactionLine = (
    user: string,
    date: string,
    amount: number,
    note: string
  ) => (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4">
      <div className="flex flex-col">
        <p className="text-sm font-medium">
          {amount >= 0 ? "Received from" : "Sent to"}{" "}
          <span className="bold">{user}</span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
      </div>
      <div className="flex items-center gap-2">
        {amount >= 0 ? (
          <p className="text-sm font-medium text-green-500">
            +{amount}
            {""}€
          </p>
        ) : (
          <p className="text-sm font-medium text-red-500">
            {amount}
            {""}€
          </p>
        )}
        {amount >= 0 ? (
          <ArrowUpIcon className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDownIcon className="h-4 w-4 text-red-500" />
        )}
      </div>
    </div>
  );

  const makeRandomTransaction = () => {
    const users = ["John", "Jane", "Alex", "Emily"];
    const user = users[Math.floor(Math.random() * users.length)];
    const date = new Date().toLocaleDateString();
    const amount = Math.floor(Math.random() * 100) - 50;
    const note = ["Pizza", "Dinner", "Groceries", "Rent"][
      Math.floor(Math.random() * 4)
    ];
    return transactionLine(user, date, amount, note);
  };

  const sectionTransactions = (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900">
      <h2 className="text-lg font-medium">Recent Transactions</h2>
      <div className="mt-4 space-y-4">
        {makeRandomTransaction()}
        {makeRandomTransaction()}
        {makeRandomTransaction()}
        {makeRandomTransaction()}
        {makeRandomTransaction()}
      </div>
    </div>
  );

  const sectionSend = (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900">
      <h2 className="text-lg font-medium">Send Money</h2>
      <form className="mt-4 space-y-4">
        <div className="space-y-1">
          <Label htmlFor="recipient">Recipient</Label>
          <Input id="recipient" placeholder="Enter a friend's name" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" placeholder="$0.00" type="number" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="note">Note (optional)</Label>
          <Textarea id="note" placeholder="Add a note" />
        </div>
        <Button className="w-full" type="submit">
          Send Money
        </Button>
      </form>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {sectionBalance}
      {sectionTransactions}
    </div>
  );
}
