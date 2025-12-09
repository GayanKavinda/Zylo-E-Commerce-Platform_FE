//app/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, AlertCircle, ShoppingCart } from "lucide-react";
import { useLogin } from "@/lib/hooks/useAuth";
import { AxiosError } from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const router = useRouter();
  const loginMutation = useLogin();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginMutation.mutateAsync({ email, password });

      // Navigate based on role
      if (data.user.role === "superadmin" || data.user.role === "admin") {
        router.push("/admin");
      } else if (data.user.role === "seller") {
        router.push("/seller/dashboard");
      } else {
        router.push("/dashboard/customer");
      }
    } catch (err) {
      const e = err as AxiosError<{ message?: string }>;
      setError(e.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8">
      <Card className="w-full max-w-md shadow-xl dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="space-y-1 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold dark:text-white">Welcome Back</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white" 
              type="submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground dark:text-gray-400 text-center">
            Don&apos;t have an account?{" "}
            <a 
              href="/register" 
              className="text-indigo-600 dark:text-indigo-400 underline-offset-4 hover:underline font-medium"
            >
              Sign up
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
