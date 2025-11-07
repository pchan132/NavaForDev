"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthForm from "@/components/auth/AuthForm";

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        console.error("Sign up failed");
      }
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return <AuthForm type="signUp" onSubmit={handleSignUp} />;
}
