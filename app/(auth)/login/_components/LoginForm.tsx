"use client";

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
import { authClient } from "@/lib/auth-client";
import { IconBrandGoogle } from "@tabler/icons-react";
import {
  Facebook,
  FacebookIcon,
  GithubIcon,
  Loader,
  Loader2,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [googlePending, startGoogleTransition] = useTransition();
  const [facebookPending, startFacebookTransition] = useTransition();

  async function signInWithGoogle() {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with Google, you will be redirected...");
          },
          onError: () => {
            toast.error("Internal server error");
          },
        },
      });
    });
  }

  async function signInWithFacebook() {
    startFacebookTransition(async () => {
      await authClient.signIn.social({
        provider: "facebook",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with Facebook, you will be redirected...");
          },
          onError: () => {
            toast.error("Internal server error");
          },
        },
      });
    });
  }

  // async function signInWithEmail() {
  //   startEmailTransition(async () => {
  //     await authClient.emailOtp.sendVerificationOtp({
  //       email,
  //       type: "sign-in",
  //       fetchOptions: {
  //         onSuccess: () => {
  //           toast.success("Verification email sent.");
  //           router.push(`/verify-request?email=${email}`);
  //         },
  //         onError: () => {
  //           toast.error("Internal server error");
  //         },
  //       },
  //     });
  //   });
  // }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back!</CardTitle>
        <CardDescription>
          Login with your Google or Facebook Account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          onClick={signInWithGoogle}
          disabled={googlePending}
          className="w-full"
          variant="outline"
        >
          {googlePending ? (
            <>
              <Loader className="animate-spin size-4" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <IconBrandGoogle className="size-4" />
              Sign in with Google
            </>
          )}
        </Button>
        <div className="relative text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <div className="grid gap-3">
          <Button
            onClick={signInWithFacebook}
            disabled={facebookPending}
            className="w-full"
            variant="outline"
          >
            {facebookPending ? (
              <>
                <Loader className="animate-spin size-4" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Facebook className="size-4" />
                Sign in with Facebook
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}