import React from "react";
import { motion } from "framer-motion";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "../../lib/utils";

// Table Container
interface TableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Table = ({ children, className, ...props }: TableProps) => {
  return (
    <div className={cn("w-full overflow-hidden", className)} {...props}>
      <div className="overflow-x-auto">
        <table className="w-full">{children}</table>
      </div>
    </div>
  );
};

// Table Header
interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableHeader = ({
  children,
  className,
  ...props
}: TableHeaderProps) => {
  return (
    <thead
      className={cn("bg-gradient-to-r from-gray-50 to-gray-100", className)}
      {...props}
    >
      {children}
    </thead>
  );
};

// Table Body
interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableBody = ({
  children,
  className,
  ...props
}: TableBodyProps) => {
  return (
    <tbody className={cn("divide-y divide-gray-100", className)} {...props}>
      {children}
    </tbody>
  );
};

// Table Row
interface TableRowProps {
  children: React.ReactNode;
  isHoverable?: boolean;
  className?: string;
  onClick?: () => void;
}

export const TableRow = ({
  children,
  className,
  isHoverable = true,
  onClick,
}: TableRowProps) => {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      className={cn(
        "transition-colors",
        isHoverable &&
          "hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent dark:hover:from-slate-800 dark:hover:to-transparent",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.tr>
  );
};

// Table Head Cell
interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
}

export const TableHead = ({
  children,
  className,
  sortable,
  sortDirection,
  onSort,
  ...props
}: TableHeadProps) => {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
        sortable &&
          "cursor-pointer select-none hover:text-gray-900 transition-colors",
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && (
          <span className="flex flex-col">
            <ChevronUp
              className={cn(
                "w-3 h-3 -mb-1 transition-colors",
                sortDirection === "asc" ? "text-green-600" : "text-gray-300"
              )}
            />
            <ChevronDown
              className={cn(
                "w-3 h-3 transition-colors",
                sortDirection === "desc" ? "text-green-600" : "text-gray-300"
              )}
            />
          </span>
        )}
      </div>
    </th>
  );
};

// Table Cell
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export const TableCell = ({
  children,
  className,
  ...props
}: TableCellProps) => {
  return (
    <td className={cn("px-4 py-4 text-sm text-gray-700", className)} {...props}>
      {children}
    </td>
  );
};

// Mobile Card View
interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileCard = ({ children, className }: MobileCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

// Mobile Card Row
interface MobileCardRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export const MobileCardRow = ({
  label,
  value,
  className,
}: MobileCardRowProps) => {
  return (
    <div
      className={cn(
        "flex justify-between items-center py-2 border-b border-gray-50 last:border-0",
        className
      )}
    >
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
};

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  className,
}: PaginationProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

  const getPageNumbers = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 pt-4",
        className
      )}
    >
      {totalItems !== undefined && (
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{startItem}</span> to{" "}
          <span className="font-semibold">{endItem}</span> of{" "}
          <span className="font-semibold">{totalItems}</span> results
        </p>
      )}

      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            "p-2 rounded-lg transition-all",
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )}
          aria-label="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "p-2 rounded-lg transition-all",
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-2 text-gray-400">...</span>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange(page as number)}
                  className={cn(
                    "min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all",
                    currentPage === page
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  {page}
                </motion.button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "p-2 rounded-lg transition-all",
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            "p-2 rounded-lg transition-all",
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )}
          aria-label="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Empty State
interface TableEmptyProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const TableEmpty = ({
  icon,
  title,
  description,
  action,
}: TableEmptyProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-12 text-center"
    >
      {icon && (
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-4">{description}</p>
      )}
      {action}
    </motion.div>
  );
};

// Badge Component for status
interface StatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
}

const statusVariants = {
  default: "bg-gray-100 text-gray-700 ring-gray-600/20",
  success: "bg-green-100 text-green-700 ring-green-600/20",
  warning: "bg-yellow-100 text-yellow-700 ring-yellow-600/20",
  error: "bg-red-100 text-red-700 ring-red-600/20",
  info: "bg-blue-100 text-blue-700 ring-blue-600/20",
};

export const StatusBadge = ({
  status,
  variant = "default",
  className,
}: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ring-1",
        statusVariants[variant],
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          variant === "success" && "bg-green-500",
          variant === "warning" && "bg-yellow-500",
          variant === "error" && "bg-red-500",
          variant === "info" && "bg-blue-500",
          variant === "default" && "bg-gray-500"
        )}
      />
      {status}
    </span>
  );
};
