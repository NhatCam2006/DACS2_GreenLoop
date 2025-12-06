import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { apiClient } from "../lib/api-client";
import { useAuthStore } from "../stores/auth.store";
import { Container } from "../components/layout/Container";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Leaf, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/login", data);
      const { user, token } = response.data;

      setAuth(user, token);
      toast.success("Welcome back!");

      // Redirect based on role
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (user.role === "COLLECTOR") {
        navigate("/collector/dashboard");
      } else {
        navigate("/donor/dashboard");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-12 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 dark:bg-green-900 rounded-full opacity-30 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 dark:bg-emerald-900 rounded-full opacity-30 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <Container size="sm" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 mb-6 group"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30"
              >
                <Leaf className="w-7 h-7 text-white" />
              </motion.div>
              <span className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                GreenLoop
              </span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                Welcome Back! 👋
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Sign in to continue your green journey
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="glass" className="backdrop-blur-xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="your.email@example.com"
                    error={errors.email?.message}
                    leftIcon={<Mail className="w-5 h-5" />}
                    {...register("email")}
                  />

                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    leftIcon={<Lock className="w-5 h-5" />}
                    {...register("password")}
                  />

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-green-600 focus:ring-green-500 focus:ring-offset-0 dark:bg-slate-700 transition-colors"
                      />
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                        Remember me
                      </span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isLoading}
                    rightIcon={
                      !isLoading ? (
                        <ArrowRight className="w-5 h-5" />
                      ) : undefined
                    }
                  >
                    Sign In
                  </Button>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setValue("email", "donor@greenloop.local");
                        setValue("password", "Donor@123");
                      }}
                    >
                      Demo Donor
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setValue("email", "collector@greenloop.local");
                        setValue("password", "Collector@123");
                      }}
                    >
                      Demo Collector
                    </Button>
                  </div>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="secondary" className="w-full" type="button">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button variant="secondary" className="w-full" type="button">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </Button>
                </div>

                <p className="mt-8 text-center text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold transition-colors"
                  >
                    Sign up now
                  </Link>
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Demo accounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  Demo Accounts
                </p>
              </div>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center justify-between bg-white/60 dark:bg-slate-800/60 rounded-lg px-4 py-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Admin:
                  </span>
                  <code className="text-blue-700 dark:text-blue-300 font-mono text-xs">
                    admin@greenloop.local / Admin@123
                  </code>
                </div>
                <div className="flex items-center justify-between bg-white/60 dark:bg-slate-800/60 rounded-lg px-4 py-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Donor:
                  </span>
                  <code className="text-green-700 dark:text-green-300 font-mono text-xs">
                    donor@greenloop.local / Donor@123
                  </code>
                </div>
                <div className="flex items-center justify-between bg-white/60 dark:bg-slate-800/60 rounded-lg px-4 py-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Collector:
                  </span>
                  <code className="text-purple-700 dark:text-purple-300 font-mono text-xs">
                    collector@greenloop.local / Collector@123
                  </code>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
};
