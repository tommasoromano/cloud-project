"use client";

import { Amplify, type ResourcesConfig } from "aws-amplify";

export const authConfig: ResourcesConfig["Auth"] = {
  Cognito: {
    userPoolId: String(process.env.NEXT_PUBLIC_USER_POOL_ID),
    userPoolClientId: String(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID),
  },
};

Amplify.configure(
  {
    Auth: authConfig,
    API: {
      REST: {
        "cloud-project-api-rest": {
          endpoint: "https://z07r0dozg2.execute-api.eu-central-1.amazonaws.com/cloudprojectstage"
        }
      }
    }
  },
  { ssr: true }
);

export default function ConfigureAmplifyClientSide() {
  return null;
}
