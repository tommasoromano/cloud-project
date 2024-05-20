"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CircleUser, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { LoginForm } from "./login";
import { useEffect, useState } from "react";
import { SignupForm } from "./signup";
import { useRouter } from "next/navigation";
import useAuthUser from "@/app/hooks/use-auth-user";
import { handleSignOut } from "@/lib/cognitoActions";

export const Header = ({}: {}) => {
  const router = useRouter();
  const [_user, isLoading] = useAuthUser();
  const [user, setUser] = useState(_user);
  useEffect(() => {
    setUser(_user);
  }, [_user, isLoading]);

  const hasUser = user && (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src="" />
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback>
              {(user.email?.[0] || "").toUpperCase()}
              {(user.email?.[1] || "").toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* {<DropdownMenuItem>{user.userId}</DropdownMenuItem>} */}
        {/* {<DropdownMenuItem>{user.username}</DropdownMenuItem>} */}
        {<DropdownMenuItem>{user.email}</DropdownMenuItem>}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleSignOut()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="fixed z-10 top-0 left-0 w-full bg-primary flex flex-col items-center justify-center shadow-md">
      <div className="max-w-screen-sm p-2 w-full">
        <div className="flex flex-row items-center justify-between gap-2 w-full">
          <Link href={"/"}>
            <h1 className="text-xl font-bold text-primary-foreground">
              BuddyPay
            </h1>
          </Link>
          {isLoading ? (
            <Button>
              <Loader2 className="h-8 w-8 animate-spin" />
            </Button>
          ) : user ? (
            hasUser
          ) : (
            <Button
              onClick={() => router.push("/auth/login")}
              variant={"secondary"}
            >
              Login
            </Button>
          )}
        </div>
      </div>
      {/* <LoginBlocker /> */}
    </header>
  );
};

const LoginBlocker = ({}: {}) => {
  const [kind, setKind] = useState("login");

  return (
    <AlertDialog open>
      {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
      <AlertDialogContent className="bg-transparent border-transparent">
        {kind === "login" ? <LoginForm /> : <SignupForm />}
      </AlertDialogContent>
    </AlertDialog>
  );
};
