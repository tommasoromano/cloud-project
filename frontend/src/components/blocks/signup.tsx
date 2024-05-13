"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleSignUp } from "@/lib/cognitoActions";
import { useFormState } from "react-dom";

export const SignupForm = ({}: {}) => {
  const [errorMessage, dispatch] = useFormState(handleSignUp, undefined);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={(fd) => {
            console.log(fd);
            dispatch(fd);
          }}
          className="grid gap-4"
        >
          {/* <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">First name</Label>
              <Input id="name" placeholder="Max" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="family_name">Last name</Label>
              <Input id="family_name" placeholder="Robinson" required />
            </div>
          </div> */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" name="password" required />
          </div>
          <Button type="submit" className="w-full">
            Create an account
          </Button>
          {/* <Button variant="outline" className="w-full">
            Sign up with GitHub
          </Button> */}
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline">
            Login
          </Link>
        </div>
        <div className="mt-4 text-center text-sm">
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
      </CardContent>
    </Card>
  );
};
