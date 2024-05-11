import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const sectionBalance = (
    <div className="rounded-lg bg-primary p-6 shadow-sm">
      <div className="flex items-center justify-between text-primary-foreground">
        <div>
          <h2 className="text-lg font-medium">
            Hello <span className="font-black">Tommaso</span> ☀️
          </h2>
          <p className="text-3xl font-bold">$2,546.78</p>
        </div>
        <Button size="sm" variant="outline" className="text-primary">
          Add Funds
        </Button>
      </div>
    </div>
  );

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

  const transactionLine = (
    user: string,
    timestamp: number,
    amount: number,
    status: string,
    note: string
  ) => (
    <div className="w-full flex flex-row justify-between items-center">
      <div className="flex flex-row items-center gap-6">
        <div className="flex flex-col items-center justify-center">
          <span className="text-xs">
            {monthNames[new Date(timestamp).getMonth() - 1].toUpperCase()}
          </span>
          <span className="font-bold">{new Date(timestamp).getDay()}</span>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium">
            {amount >= 0 ? "Received from" : "Sent to"}{" "}
            <span className="font-bold">{user}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {status === "success" ? null : status === "failed" ? (
              <Badge variant="destructive" className="text-xs">
                Failed
              </Badge>
            ) : (
              <Badge className="text-xs">Pending</Badge>
            )}{" "}
            {note}
          </p>
        </div>
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
    const date = new Date(
      2023,
      Math.floor(Math.random() * 10) + 1,
      Math.floor(Math.random() * 26) + 1
    ).getTime();
    const amount = Math.floor(Math.random() * 100) - 50;
    const status = ["pending", "success", "failed"][
      Math.floor(Math.random() * 3)
    ];
    const note = ["Pizza", "Dinner", "Groceries", "Rent"][
      Math.floor(Math.random() * 4)
    ];
    return transactionLine(user, date, amount, status, note);
  };

  const sectionTransactions = (
    <div className="rounded-lg bg-background p-6 shadow-sm">
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
      {/* {sectionHeader} */}
      {sectionBalance}
      {sectionTransactions}
    </div>
  );
}
