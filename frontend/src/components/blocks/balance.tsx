import { Transaction, calculateBalance, userToName } from "@/types/types";
import { Button } from "../ui/button";
import Link from "next/link";
import useAuthUser from "@/app/hooks/use-auth-user";

export const HeroBalance = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  const [user, isLoading] = useAuthUser();

  if (!user) {
    return null;
  }

  return (
    <div className="rounded-lg bg-primary p-6 shadow-sm w-full">
      <div className="flex items-center justify-between text-primary-foreground">
        <div>
          <h2 className="text-lg font-medium">
            Hello{" "}
            {/* <span className="font-black">{user?.email?.split("@")[0]}</span> ☀️ */}
            <span className="font-black">{userToName(user.userId)}</span> ☀️
          </h2>
          {/* <p className="text-3xl font-bold">$2,546.78</p> */}
          <p className="text-3xl font-bold">
            {calculateBalance(transactions, user.userId).toFixed(2)}€
          </p>
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <Link href="/send">
            <Button size="sm" variant="outline" className="text-primary">
              Send
            </Button>
          </Link>
          <Button size="sm" variant="outline" className="text-primary">
            Request
          </Button>
        </div>
      </div>
    </div>
  );
};
