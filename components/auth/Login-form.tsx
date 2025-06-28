"use client";
import React from "react";
import * as z from "zod";
import { CardWrapper } from "./CardWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
  FormField,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "../form-error";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import FormSuccess from "../form-success";
import Link from "next/link";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/utils/tokens";
import { sendTwoFactorTokenEmail } from "@/utils/sendVerificationEmail";

function LoginForm() {
  const [showTwoFactor, setShowTwoFactor] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "This account is already linked with another provider. Please login with that provider."
      : "";
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError(null);
    setSuccess(null);

    if (showTwoFactor) {
      // 🔐 User is submitting 2FA code
      try {
        const response = await axios.post("/api/auth/2fa-check", {
          email: values.email,
          code: values.code,
        });

        if (response.status === 200) {
          toast.success("2FA verification successful");
        } else {
          setError(response.data?.error || "2FA verification failed");
          return;
        }
      } catch (error: any) {
        setError("2FA verification failed.");
        return;
      }
    } else {
      try {
        const response = await axios.post("/api/auth/2fa-check", {
          email: values.email,
        });

        if (response.data.twoFactor) {
          setShowTwoFactor(true);
          setSuccess("2FA code sent to your email");
          return; // ⛔ Wait for next submit with code
        }
      } catch (error) {
        setError("2FA check failed.");
        return;
      }
    }

    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    console.log(result?.error);

    if (result?.error) {
      if (result.error === "Email not verified") {
        try {
          const response = await axios.post("/api/email-verification", {
            email: values.email,
          });
          if (response.data.message === "Verification email sent") {
            setSuccess("Email not verified. Verification email sent.");
          } else if (response.data.message === "Email already verified") {
            setError("Login failed. Please check your password.");
          } else {
            setError("Unexpected response while sending verification email.");
          }
        } catch (error: any) {
          setError("Failed to send verification email.");
        }
      } else {
        setError(result.error);
      }
      return;
    }
    if (result?.ok) {
      form.reset();
      setSuccess("Login successful. Redirecting to dashboard...");
    }
    router.replace("/dashboard");
  };

  return (
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account? Sign up"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two-Factor Authentication Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your 2FA code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your password"
                          type="password"
                        />
                      </FormControl>
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-bold"
                      >
                        <Link href="/auth/reset">Forgot Password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          {error && <FormError errorMessage={error} />}
          {urlError && <FormError errorMessage={urlError} />}
          {success && <FormSuccess successMessage={success} />}
          <Button type="submit" className="w-full">
            {showTwoFactor ? "Verify Code" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}

export default LoginForm;
