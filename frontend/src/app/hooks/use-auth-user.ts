import {
  AuthUser,
  FetchUserAttributesOutput,
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
} from "aws-amplify/auth";
import { useEffect, useState } from "react";

type User =
  | (AuthUser & FetchUserAttributesOutput & { isAdmin: boolean })
  | undefined;

export default function useAuthUser() {
  const [user, setUser] = useState<[User, boolean]>([undefined, true]);

  useEffect(() => {
    async function getUser() {
      const session = await fetchAuthSession();
      if (!session.tokens) {
        return;
      }
      const user = {
        ...(await getCurrentUser()),
        ...(await fetchUserAttributes()),
        isAdmin: false,
      };
      const groups = session.tokens.accessToken.payload["cognito:groups"];
      // @ts-ignore
      user.isAdmin = Boolean(groups && groups.includes("Admins"));
      setUser([user as User, false]);
    }

    getUser();
  }, []);

  return user;
}
