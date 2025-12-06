import React, { createContext, useContext, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

// Context for Tabs
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
};

// Tabs Root
interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
}: TabsProps) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

// Tabs List
interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "pills" | "underline";
}

export const TabsList = ({
  children,
  className,
  variant = "default",
}: TabsListProps) => {
  const variants = {
    default: "bg-gray-100 p-1 rounded-xl",
    pills: "gap-2",
    underline: "border-b border-gray-200 gap-4",
  };

  return (
    <div
      className={cn("flex items-center", variants[variant], className)}
      role="tablist"
    >
      {children}
    </div>
  );
};

// Tab Trigger
interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  variant?: "default" | "pills" | "underline";
}

export const TabsTrigger = ({
  value,
  children,
  className,
  disabled,
  icon,
  badge,
  variant = "default",
}: TabsTriggerProps) => {
  const { value: selectedValue, onValueChange } = useTabsContext();
  const isSelected = selectedValue === value;

  const baseStyles =
    "relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    default: cn(
      "rounded-lg",
      isSelected
        ? "bg-white text-gray-900 shadow-sm"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
    ),
    pills: cn(
      "rounded-full",
      isSelected
        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
    ),
    underline: cn(
      "pb-3 rounded-none border-b-2 -mb-px",
      isSelected
        ? "border-green-500 text-green-600"
        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
    ),
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      disabled={disabled}
      onClick={() => onValueChange(value)}
      className={cn(baseStyles, variants[variant], className)}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {badge && (
        <span
          className={cn(
            "ml-1 px-2 py-0.5 text-xs font-semibold rounded-full",
            isSelected
              ? variant === "pills"
                ? "bg-white/20 text-white"
                : "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          )}
        >
          {badge}
        </span>
      )}
      {variant === "default" && isSelected && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
};

// Tab Content
interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  forceMount?: boolean;
}

export const TabsContent = ({
  value,
  children,
  className,
  forceMount = false,
}: TabsContentProps) => {
  const { value: selectedValue } = useTabsContext();
  const isSelected = selectedValue === value;

  if (!forceMount && !isSelected) return null;

  return (
    <motion.div
      role="tabpanel"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isSelected ? 1 : 0, y: isSelected ? 0 : 10 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "mt-4 focus:outline-none",
        !isSelected && forceMount && "hidden",
        className
      )}
      hidden={!isSelected && !forceMount}
    >
      {children}
    </motion.div>
  );
};
