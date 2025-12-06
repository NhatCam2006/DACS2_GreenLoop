import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "../lib/api-client";
import { useAuthStore } from "../stores/auth.store";
import { Container } from "../components/layout/Container";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import {
  Leaf,
  User,
  Truck,
  Mail,
  Lock,
  Phone,
  UserCircle,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
  role: z.enum(["DONOR", "COLLECTOR"]),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"DONOR" | "COLLECTOR">(
    "DONOR"
  );
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "DONOR",
    },
  });

  const fullName = watch("fullName");
  const email = watch("email");

  const handleRoleSelect = (role: "DONOR" | "COLLECTOR") => {
    setSelectedRole(role);
    setValue("role", role);
  };

  const handleNextStep = () => {
    if (fullName && email) {
      setStep(2);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/register", data);
      const { user, token } = response.data;

      setAuth(user, token);
      toast.success("Account created successfully!");

      // Redirect based on role
      if (user.role === "COLLECTOR") {
        navigate("/collector");
      } else {
        navigate("/donor");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-green-400/30 dark:bg-green-900/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/30 dark:bg-emerald-900/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-400/20 dark:bg-blue-900/20 rounded-full blur-3xl"
        />
      </div>

      <Container className="relative z-10 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30"
            >
              <Leaf className="w-7 h-7 text-white" />
            </motion.div>
            <span className="text-2xl font-heading font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              GreenLoop
            </span>
          </Link>
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            Join the Green Revolution
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create your account and start making a difference
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div
            className={`flex items-center gap-2 ${
              step >= 1 ? "text-green-600 dark:text-green-400" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400"
              }`}
            >
              {step > 1 ? <CheckCircle className="w-5 h-5" /> : "1"}
            </div>
            <span className="text-sm font-medium hidden sm:inline">
              Basic Info
            </span>
          </div>
          <div
            className={`w-12 h-1 rounded-full transition-all ${
              step >= 2 ? "bg-green-600" : "bg-gray-200 dark:bg-slate-700"
            }`}
          />
          <div
            className={`flex items-center gap-2 ${
              step >= 2 ? "text-green-600 dark:text-green-400" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= 2
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400"
              }`}
            >
              2
            </div>
            <span className="text-sm font-medium hidden sm:inline">
              Security
            </span>
          </div>
        </motion.div>

        {/* Role Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-6"
        >
          <motion.button
            type="button"
            onClick={() => handleRoleSelect("DONOR")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${
              selectedRole === "DONOR"
                ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 shadow-lg shadow-green-500/20"
                : "border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:border-green-200 dark:hover:border-green-800 hover:bg-green-50/50 dark:hover:bg-green-900/20"
            }`}
          >
            {selectedRole === "DONOR" && (
              <motion.div
                layoutId="roleIndicator"
                className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10"
              />
            )}
            <div
              className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center transition-all ${
                selectedRole === "DONOR"
                  ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-400"
              }`}
            >
              <User className="w-6 h-6" />
            </div>
            <h3
              className={`font-semibold text-sm mb-0.5 ${
                selectedRole === "DONOR"
                  ? "text-green-700 dark:text-green-300"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              I'm a Donor
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Donate recyclables
            </p>
            {selectedRole === "DONOR" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </motion.button>

          <motion.button
            type="button"
            onClick={() => handleRoleSelect("COLLECTOR")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${
              selectedRole === "COLLECTOR"
                ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-lg shadow-blue-500/20"
                : "border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
            }`}
          >
            {selectedRole === "COLLECTOR" && (
              <motion.div
                layoutId="roleIndicator"
                className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10"
              />
            )}
            <div
              className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center transition-all ${
                selectedRole === "COLLECTOR"
                  ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-400"
              }`}
            >
              <Truck className="w-6 h-6" />
            </div>
            <h3
              className={`font-semibold text-sm mb-0.5 ${
                selectedRole === "COLLECTOR"
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              I'm a Collector
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Collect recyclables
            </p>
            {selectedRole === "COLLECTOR" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-md mx-auto"
        >
          <Card
            variant="glass"
            className="backdrop-blur-xl border border-white/50 shadow-2xl"
          >
            <CardContent className="pt-6 pb-8 px-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <Input
                        label="Full Name"
                        placeholder="John Doe"
                        error={errors.fullName?.message}
                        leftIcon={
                          <UserCircle className="w-5 h-5 text-gray-400" />
                        }
                        {...register("fullName")}
                        required
                      />

                      <Input
                        label="Email"
                        type="email"
                        placeholder="your.email@example.com"
                        error={errors.email?.message}
                        leftIcon={<Mail className="w-5 h-5 text-gray-400" />}
                        {...register("email")}
                        required
                      />

                      <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="0123456789"
                        error={errors.phone?.message}
                        leftIcon={<Phone className="w-5 h-5 text-gray-400" />}
                        {...register("phone")}
                      />

                      <Button
                        type="button"
                        className="w-full"
                        size="lg"
                        variant="gradient"
                        onClick={handleNextStep}
                        rightIcon={<ArrowRight className="w-5 h-5" />}
                      >
                        Continue
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      {/* User Summary */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              selectedRole === "DONOR"
                                ? "bg-gradient-to-br from-green-500 to-emerald-600"
                                : "bg-gradient-to-br from-blue-500 to-indigo-600"
                            }`}
                          >
                            {selectedRole === "DONOR" ? (
                              <User className="w-6 h-6 text-white" />
                            ) : (
                              <Truck className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {fullName || "Your Name"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {email || "email@example.com"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="ml-auto text-xs text-green-600 hover:text-green-700 font-medium"
                          >
                            Edit
                          </button>
                        </div>
                      </div>

                      <Input
                        label="Create Password"
                        type="password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
                        hint="At least 8 characters"
                        {...register("password")}
                        required
                      />

                      <input type="hidden" {...register("role")} />

                      <div className="pt-2">
                        <label className="flex items-start space-x-3 text-sm cursor-pointer group">
                          <input
                            type="checkbox"
                            required
                            className="mt-0.5 w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-offset-0"
                          />
                          <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                            I agree to the{" "}
                            <Link
                              to="/terms"
                              className="text-green-600 hover:text-green-700 font-medium underline"
                            >
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                              to="/privacy"
                              className="text-green-600 hover:text-green-700 font-medium underline"
                            >
                              Privacy Policy
                            </Link>
                          </span>
                        </label>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          onClick={() => setStep(1)}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="flex-[2]"
                          size="lg"
                          variant="gradient"
                          isLoading={isLoading}
                          leftIcon={<Sparkles className="w-5 h-5" />}
                        >
                          Create Account
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Already have an account?
                    </span>
                  </div>
                </div>
                <Link
                  to="/login"
                  className="mt-4 inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
                >
                  Sign in to your account
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};
