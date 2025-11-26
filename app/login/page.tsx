//app/login/page.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";
import useAuthStore from "@/lib/authStore";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  Eye, 
  EyeOff, 
  ShoppingBag, 
  Sparkles, 
  Lock, 
  Mail,
  Heart,
  Star,
  Gift,
  Crown,
  Zap,
  Award,
  TrendingUp,
  Package
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);
  const router = useRouter();

  const floatingIconRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      floatingIconRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          const distanceX = e.clientX - centerX;
          const distanceY = e.clientY - centerY;
          const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
          
          const maxDistance = 250;
          const strength = Math.max(0, 1 - distance / maxDistance);
          
          const moveX = distanceX * strength * 0.25;
          const moveY = distanceY * strength * 0.25;
          
          ref.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${strength * 15}deg) scale(${1 + strength * 0.2})`;
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/login", { email, password });
      setUser(res.data.user);
      setToken(res.data.token);

      if (res.data.user.role === "admin") router.push("/admin");
      else if (res.data.user.role === "seller") router.push("/seller");
      else router.push("/dashboard/customer");
    } catch (err) {
      const e = err as AxiosError<{ message?: string }>;
      setError(e.response?.data?.message || "Invalid credentials");
    }
  };

  const floatingIcons = [
    { Icon: Heart, color: "from-pink-400 to-rose-500", position: { top: "10%", right: "15%" } },
    { Icon: Star, color: "from-yellow-400 to-orange-500", position: { top: "25%", right: "8%" } },
    { Icon: Gift, color: "from-purple-400 to-indigo-500", position: { top: "45%", right: "12%" } },
    { Icon: Crown, color: "from-amber-400 to-yellow-500", position: { top: "15%", right: "25%" } },
    { Icon: Zap, color: "from-cyan-400 to-blue-500", position: { top: "60%", right: "20%" } },
    { Icon: Award, color: "from-green-400 to-emerald-500", position: { top: "70%", right: "10%" } },
    { Icon: TrendingUp, color: "from-blue-400 to-indigo-500", position: { top: "35%", right: "22%" } },
    { Icon: Package, color: "from-violet-400 to-purple-500", position: { top: "80%", right: "15%" } },
  ];

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.03),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      {/* Left side - Login Form */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md backdrop-blur-sm bg-white/80 border-gray-200 shadow-2xl">
          <CardHeader className="text-center space-y-4 pt-8">
            <div className="flex justify-center mb-2">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg transform hover:scale-110 hover:rotate-6 transition-all duration-500">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Sign in to continue your shopping journey
            </CardDescription>
          </CardHeader>

          <CardContent className="relative">
            {error && (
              <Alert variant="destructive" className="mb-4 border-red-200 bg-red-50">
                <AlertTitle className="text-red-800">Error</AlertTitle>
                <AlertDescription className="text-red-600">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={submit} className="space-y-6">
              <div className="group">
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                  <Mail size={16} className="text-purple-600" />
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-400 h-12"
                />
              </div>

              <div className="group">
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                  <Lock size={16} className="text-purple-600" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20 pr-12 transition-all duration-300 hover:border-purple-400 h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors p-1 hover:bg-purple-50 rounded"
                  >
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-gray-600 group-hover:text-purple-600 transition-colors">
                    Remember me
                  </span>
                </label>
                <a 
                  href="/forgot-password" 
                  className="text-purple-600 hover:text-pink-600 font-medium transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transform hover:scale-[1.02] transition-all duration-300" 
                type="submit"
              >
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <Sparkles size={20} className="animate-pulse" />
                </span>
              </Button>
            </form>

            {/* Social Login Options */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-purple-400 transition-all duration-300 hover:shadow-md transform hover:scale-[1.02]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Google</span>
                </button>
                <button 
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-purple-400 transition-all duration-300 hover:shadow-md transform hover:scale-[1.02]"
                >
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Facebook</span>
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="text-center text-sm border-t border-gray-200 pt-6">
            <p className="w-full text-gray-600">
              Don&apos;t have an account?{" "}
              <a 
                href="/register" 
                className="text-purple-600 hover:text-pink-600 font-semibold underline decoration-2 underline-offset-2 transition-colors"
              >
                Create Account
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Right side - Floating Icons */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-6 px-12">
            <h2 className="text-5xl font-bold text-gray-800 leading-tight">
              Discover Amazing
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Products & Deals
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Shop smarter with exclusive offers and trending items
            </p>
          </div>
        </div>

        {/* Floating Icons */}
        {floatingIcons.map((item, index) => (
          <div
            key={index}
            ref={(el) => {
              floatingIconRefs.current[index] = el;
            }}
            className="absolute animate-float"
            style={{
              top: item.position.top,
              right: item.position.right,
              animationDelay: `${index * 0.5}s`,
            }}
          >
            <div className={`p-6 bg-gradient-to-br ${item.color} rounded-3xl shadow-2xl backdrop-blur-sm transition-all duration-500 hover:shadow-3xl`}>
              <item.Icon className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
