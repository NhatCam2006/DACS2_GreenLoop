import React, { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

// Linear Progress Bar
interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error" | "gradient";
  animated?: boolean;
  className?: string;
}

export const Progress = ({
  value,
  max = 100,
  label,
  showValue = false,
  size = "md",
  variant = "default",
  animated = true,
  className,
}: ProgressProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const variants = {
    default: "bg-green-500",
    success: "bg-emerald-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    gradient: "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500",
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-gray-900">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full bg-gray-100 rounded-full overflow-hidden",
          sizes[size]
        )}
      >
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full transition-all",
            variants[variant],
            animated && "relative overflow-hidden"
          )}
        >
          {animated && variant === "gradient" && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Circular Progress
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  label?: string;
  variant?: "default" | "success" | "warning" | "error" | "gradient";
  animated?: boolean;
  className?: string;
}

export const CircularProgress = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  showValue = true,
  label,
  variant = "default",
  animated = true,
  className,
}: CircularProgressProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colors = {
    default: { stroke: "#22c55e", gradient: ["#22c55e", "#10b981"] },
    success: { stroke: "#10b981", gradient: ["#10b981", "#059669"] },
    warning: { stroke: "#f59e0b", gradient: ["#f59e0b", "#d97706"] },
    error: { stroke: "#ef4444", gradient: ["#ef4444", "#dc2626"] },
    gradient: {
      stroke: "url(#progressGradient)",
      gradient: ["#22c55e", "#06b6d4"],
    },
  };

  const gradientId = useId();

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors[variant].gradient[0]} />
            <stop offset="100%" stopColor={colors[variant].gradient[1]} />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={
            variant === "gradient"
              ? `url(#${gradientId})`
              : colors[variant].stroke
          }
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={
            animated
              ? { strokeDashoffset: circumference }
              : { strokeDashoffset }
          }
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <motion.span
            initial={animated ? { opacity: 0, scale: 0.5 } : {}}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="text-2xl font-bold text-gray-900"
          >
            {Math.round(percentage)}%
          </motion.span>
        )}
        {label && <span className="text-xs text-gray-500 mt-1">{label}</span>}
      </div>
    </div>
  );
};

// Steps Progress
interface Step {
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface StepsProgressProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const StepsProgress = ({
  steps,
  currentStep,
  className,
}: StepsProgressProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="relative flex items-center justify-between">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
            initial={{ width: "0%" }}
            animate={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep - 1;

          return (
            <div key={index} className="relative flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold z-10 transition-all",
                  isCompleted
                    ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                    : isCurrent
                    ? "bg-white border-2 border-green-500 text-green-600"
                    : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                )}
              >
                {step.icon || (isCompleted ? "✓" : index + 1)}
              </motion.div>
              <div className="mt-3 text-center">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isCompleted || isCurrent ? "text-gray-900" : "text-gray-400"
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-0.5 max-w-[120px]">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Segmented Progress
interface SegmentedProgressProps {
  segments: { value: number; color: string; label?: string }[];
  total: number;
  height?: number;
  showLabels?: boolean;
  className?: string;
}

export const SegmentedProgress = ({
  segments,
  total,
  height = 12,
  showLabels = false,
  className,
}: SegmentedProgressProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div
        className="w-full bg-gray-100 rounded-full overflow-hidden flex"
        style={{ height }}
      >
        {segments.map((segment, index) => {
          const width = (segment.value / total) * 100;
          return (
            <motion.div
              key={index}
              initial={{ width: 0 }}
              animate={{ width: `${width}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{ backgroundColor: segment.color }}
            />
          );
        })}
      </div>
      {showLabels && (
        <div className="flex justify-between mt-2 gap-4">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-gray-600">
                {segment.label || `Segment ${index + 1}`}
              </span>
              <span className="font-semibold text-gray-900">
                {segment.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
