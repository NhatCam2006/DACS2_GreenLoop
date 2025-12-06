import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useThemeStore } from "../../stores/theme.store";
import { cn } from "../../lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: "button" | "switch" | "dropdown";
  size?: "sm" | "md" | "lg";
}

export const ThemeToggle = ({
  className,
  showLabel = false,
  variant = "button",
  size = "md",
}: ThemeToggleProps) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useThemeStore();

  const icons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const labels = {
    light: "Light",
    dark: "Dark",
    system: "System",
  };

  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const Icon = icons[theme];

  if (variant === "switch") {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          "relative inline-flex h-10 w-20 items-center rounded-full transition-colors",
          resolvedTheme === "dark" ? "bg-gray-700" : "bg-gray-200",
          className
        )}
        aria-label="Toggle theme"
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-full",
            resolvedTheme === "dark"
              ? "ml-11 bg-gray-800 text-yellow-400"
              : "ml-1 bg-white text-yellow-500 shadow-md"
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="h-5 w-5" />
            </motion.div>
          </AnimatePresence>
        </motion.span>
      </button>
    );
  }

  if (variant === "dropdown") {
    return (
      <div
        className={cn(
          "flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl",
          className
        )}
      >
        {(["light", "dark", "system"] as const).map((t) => {
          const TIcon = icons[t];
          return (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={cn(
                "relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                theme === t
                  ? "text-green-600"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              )}
              aria-label={`Set ${t} theme`}
            >
              {theme === t && (
                <motion.div
                  layoutId="theme-indicator"
                  className="absolute inset-0 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <TIcon className="h-4 w-4" />
                {showLabel && labels[t]}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Default button variant
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={cn(
        "relative flex items-center justify-center rounded-xl transition-all",
        sizes[size],
        "bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700",
        "text-gray-600 dark:text-gray-300",
        className
      )}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className={iconSizes[size]} />
        </motion.div>
      </AnimatePresence>
      {showLabel && (
        <span className="ml-2 text-sm font-medium">{labels[theme]}</span>
      )}
    </motion.button>
  );
};
