"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";
import { useRegister } from "@/lib/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "seller">("customer");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  // ✅ Use TanStack Query mutation for register
  const registerMutation = useRegister();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Use TanStack Query mutation
      const data = await registerMutation.mutateAsync({
        name,
        email,
        password,
        password_confirmation: password,
        role,
      });

      // Redirect based on user role after successful registration
      if (data.user.role === "superadmin" || data.user.role === "admin") {
        router.push("/admin");
      } else if (data.user.role === "seller") {
        router.push("/seller/dashboard");
      } else {
        router.push("/dashboard/customer");
      }
    } catch (err) {
      const e = err as AxiosError<{ message?: string }>;
      setError(e.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8">
      <Card className="w-full max-w-md shadow-xl dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Eye className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold dark:text-white">Create Account</CardTitle>
          <CardDescription className="dark:text-gray-400">Sign up to get started</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={submit} className="space-y-4">
            <Input
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Email"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <Input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 text-muted-foreground"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">Register as:</label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={role === "customer"}
                    onChange={(e) => setRole(e.target.value as "customer")}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm dark:text-gray-300">Customer</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={role === "seller"}
                    onChange={(e) => setRole(e.target.value as "seller")}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm dark:text-gray-300">Seller</span>
                </label>
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white" 
              type="submit" 
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center text-sm">
          <p className="w-full text-muted-foreground dark:text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 dark:text-indigo-400 underline font-medium">Login</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
