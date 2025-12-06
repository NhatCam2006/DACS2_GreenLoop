import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";

export interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  variant?: "default" | "glass" | "gradient" | "bordered";
  hover?: boolean;
  glow?: boolean;
}

const MotionDiv = motion.div;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = "default", hover = false, glow = false, ...props },
    ref
  ) => {
    const variants = {
      default:
        "bg-white dark:bg-slate-800 shadow-lg shadow-gray-200/50 dark:shadow-slate-900/50",
      glass:
        "bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 shadow-xl",
      gradient:
        "bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 shadow-xl",
      bordered:
        "bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 shadow-sm",
    };

    const hoverStyles = hover
      ? "hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
      : "";
    const glowStyles = glow ? "hover:shadow-green-500/20" : "";

    return (
      <MotionDiv
        ref={ref}
        className={cn(
          "rounded-2xl p-6 transition-all duration-300",
          variants[variant],
          hoverStyles,
          glowStyles,
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("mb-4 space-y-1.5", className)} {...props} />
  );
});

CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn(
        "text-xl font-bold text-gray-900 dark:text-white tracking-tight",
        className
      )}
      {...props}
    />
  );
});

CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "text-sm text-gray-500 dark:text-gray-400 leading-relaxed",
        className
      )}
      {...props}
    />
  );
});

CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />;
});

CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center",
        className
      )}
      {...props}
    />
  );
});

CardFooter.displayName = "CardFooter";
