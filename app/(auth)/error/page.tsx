"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthErrorPage() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages = {
    access_denied: "You cancelled the login or denied permissions.",
    OAuthAccountNotLinked: "This account is linked with a different provider.",
    default: "Something went wrong. Please try again.",
    account_not_linked: "Your account is not linked to any social provider.",
  };

  useEffect(() => {
      router.push("/login"); // Or your preferred fallback

  }, [router]);

  return (
    <div className="text-center">
      <h1>Authentication Error</h1>
      <p>
        {
          error && error in errorMessages
            ? errorMessages[error as keyof typeof errorMessages]
            : errorMessages["default"]
        }
      </p>
    </div>
  );
}