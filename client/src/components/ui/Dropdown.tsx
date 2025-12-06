import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  searchable?: boolean;
}

export const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  error,
  disabled,
  className,
  triggerClassName,
  menuClassName,
  searchable = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return;
    onChange?.(option.value);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border bg-white transition-all text-left",
          "focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500",
          disabled
            ? "bg-gray-50 text-gray-400 cursor-not-allowed"
            : "hover:border-gray-400",
          error
            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
            : "border-gray-200",
          isOpen && "ring-2 ring-green-500 border-green-500",
          triggerClassName
        )}
      >
        <span
          className={cn(
            "flex items-center gap-2 truncate",
            !selectedOption && "text-gray-400"
          )}
        >
          {selectedOption?.icon}
          {selectedOption?.label || placeholder}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown
            className={cn(
              "w-5 h-5 flex-shrink-0 transition-colors",
              isOpen ? "text-green-500" : "text-gray-400"
            )}
          />
        </motion.span>
      </button>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 w-full mt-2 py-1 bg-white rounded-xl border border-gray-200 shadow-xl shadow-gray-200/50",
              "max-h-60 overflow-auto",
              menuClassName
            )}
          >
            {/* Search Input */}
            {searchable && (
              <div className="px-3 py-2 border-b border-gray-100">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-2 text-sm bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            )}

            {/* Options */}
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleSelect(option)}
                  disabled={option.disabled}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors",
                    option.disabled
                      ? "text-gray-300 cursor-not-allowed"
                      : "hover:bg-gradient-to-r hover:from-green-50 hover:to-transparent",
                    value === option.value && "bg-green-50 text-green-700"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {option.icon}
                    {option.label}
                  </span>
                  {value === option.value && (
                    <Check className="w-4 h-4 text-green-600" />
                  )}
                </motion.button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Multi-select Dropdown
interface MultiSelectDropdownProps
  extends Omit<DropdownProps, "value" | "onChange"> {
  value?: string[];
  onChange?: (value: string[]) => void;
}

export const MultiSelectDropdown = ({
  options,
  value = [],
  onChange,
  placeholder = "Select options",
  label,
  error,
  disabled,
  className,
  triggerClassName,
  menuClassName,
  searchable = false,
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleToggle = (option: DropdownOption) => {
    if (option.disabled) return;
    const newValue = value.includes(option.value)
      ? value.filter((v) => v !== option.value)
      : [...value, option.value];
    onChange?.(newValue);
  };

  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(value.filter((v) => v !== optionValue));
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border bg-white transition-all text-left min-h-[44px]",
          "focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500",
          disabled
            ? "bg-gray-50 text-gray-400 cursor-not-allowed"
            : "hover:border-gray-400",
          error
            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
            : "border-gray-200",
          isOpen && "ring-2 ring-green-500 border-green-500",
          triggerClassName
        )}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1">
          {selectedOptions.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            selectedOptions.map((opt) => (
              <span
                key={opt.value}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-lg text-sm"
              >
                {opt.label}
                <button
                  type="button"
                  onClick={(e) => removeOption(opt.value, e)}
                  className="hover:text-green-900 ml-0.5"
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown
            className={cn(
              "w-5 h-5 flex-shrink-0 transition-colors",
              isOpen ? "text-green-500" : "text-gray-400"
            )}
          />
        </motion.span>
      </button>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 w-full mt-2 py-1 bg-white rounded-xl border border-gray-200 shadow-xl shadow-gray-200/50",
              "max-h-60 overflow-auto",
              menuClassName
            )}
          >
            {searchable && (
              <div className="px-3 py-2 border-b border-gray-100">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-2 text-sm bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            )}

            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleToggle(option)}
                  disabled={option.disabled}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors",
                    option.disabled
                      ? "text-gray-300 cursor-not-allowed"
                      : "hover:bg-gradient-to-r hover:from-green-50 hover:to-transparent",
                    value.includes(option.value) && "bg-green-50 text-green-700"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {option.icon}
                    {option.label}
                  </span>
                  {value.includes(option.value) && (
                    <Check className="w-4 h-4 text-green-600" />
                  )}
                </motion.button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple Dropdown Menu (for user avatar menus, etc.)
interface DropdownMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: "left" | "right";
  className?: string;
}

export const DropdownMenu = ({
  trigger,
  items,
  align = "right",
  className,
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 mt-2 py-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-xl min-w-[160px]",
              align === "right" ? "right-0" : "left-0"
            )}
          >
            {items.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                disabled={item.disabled}
                className={cn(
                  "w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors text-left",
                  "hover:bg-gray-100 dark:hover:bg-slate-700",
                  item.disabled && "opacity-50 cursor-not-allowed",
                  item.className
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
