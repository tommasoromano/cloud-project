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
import { handleConfirmSignUp, handleSignUp } from "@/lib/cognitoActions";
import { useFormState } from "react-dom";
import SendVerificationCode from "./send-verification-code-form";

export const SignupCode = ({}: {}) => {
  const [errorMessage, dispatch] = useFormState(handleConfirmSignUp, undefined);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Verification</CardTitle>
        <CardDescription>Please confirm your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={(fd) => {
            console.log(fd);
            dispatch(fd);
          }}
          className="grid gap-4"
        >
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
            <Label htmlFor="code">Verification code</Label>
            <Input id="code" type="code" name="code" required />
          </div>
          <Button type="submit" className="w-full">
            Confirm
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
        <SendVerificationCode />
      </CardContent>
    </Card>
  );
};
