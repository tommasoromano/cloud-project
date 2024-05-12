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
import { useState } from "react";
import { SignupForm } from "./signup";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";

export const Header = ({}: {}) => {
  const { user, error, isLoading } = useUser();

  const router = useRouter();

  //   if (error) {
  //     router.push("/api/auth/login");
  //     return <div>{error.message}</div>;
  //   }
  //   if (!isLoading && !user) {
  //     router.push("/api/auth/login");
  //     return <div></div>;
  //   }

  //   const notHasUser = <Button variant="secondary">Login</Button>;
  const hasUser = user && (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src="" />
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback>
              {user.name?.split(" ")[0][0]}
              {user.name?.split(" ")[1][0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {<DropdownMenuItem>{user.name}</DropdownMenuItem>}
        {<DropdownMenuItem>{user.email}</DropdownMenuItem>}
        {<DropdownMenuItem>{user.nickname}</DropdownMenuItem>}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/api/auth/logout")}>
          {/* <Link href="/api/auth/logout">Logout</Link> */}
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
              onClick={() => router.push("/api/auth/login")}
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
        {kind === "login" ? (
          <LoginForm
            onClickSignup={() => {
              setKind("signup");
            }}
          />
        ) : (
          <SignupForm
            onClickLogin={() => {
              setKind("login");
            }}
          />
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
