import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../stores/auth.store";
import { useUser } from "../../hooks/useUser";
import { Button } from "../ui/Button";
import { ThemeToggle } from "../ui/ThemeToggle";
import { NotificationBell } from "../ui/NotificationBell";
import {
  Leaf,
  Menu,
  X,
  Award,
  LogOut,
  LayoutDashboard,
  User,
  Wallet,
  Plus,
  Gift,
  History,
  Package,
  MapPin,
  ClipboardList,
  Users,
  BarChart3,
  ChevronDown,
  Recycle,
  TrendingUp,
  HelpCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export const Header = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigation config based on role
  const getNavConfig = () => {
    if (!user) return { primary: [], secondary: [] };

    switch (user.role) {
      case "DONOR":
        return {
          primary: [
            {
              label: "Donate Now",
              path: "/donor/new-donation",
              icon: <Plus className="w-4 h-4" />,
              gradient: true,
            },
            {
              label: "My Donations",
              path: "/donor/history",
              icon: <History className="w-4 h-4" />,
            },
            {
              label: "Rewards",
              path: "/donor/rewards",
              icon: <Gift className="w-4 h-4" />,
            },
          ],
          secondary: [
            {
              label: "Dashboard",
              path: "/donor/dashboard",
              icon: <LayoutDashboard className="w-4 h-4" />,
            },
            {
              label: "Wallet",
              path: "/donor/wallet",
              icon: <Wallet className="w-4 h-4" />,
            },
          ],
        };
      case "COLLECTOR":
        return {
          primary: [
            {
              label: "Find Donations",
              path: "/collector/available",
              icon: <MapPin className="w-4 h-4" />,
              gradient: true,
            },
            {
              label: "My Collections",
              path: "/collector/my-collections",
              icon: <Package className="w-4 h-4" />,
            },
          ],
          secondary: [
            {
              label: "Dashboard",
              path: "/collector/dashboard",
              icon: <LayoutDashboard className="w-4 h-4" />,
            },
          ],
        };
      case "ADMIN":
        return {
          primary: [
            {
              label: "Dashboard",
              path: "/admin/dashboard",
              icon: <BarChart3 className="w-4 h-4" />,
            },
            {
              label: "Users",
              path: "/admin/users",
              icon: <Users className="w-4 h-4" />,
            },
            {
              label: "Donations",
              path: "/admin/donations",
              icon: <Package className="w-4 h-4" />,
            },
          ],
          secondary: [
            {
              label: "Categories",
              path: "/admin/categories",
              icon: <ClipboardList className="w-4 h-4" />,
            },
            {
              label: "Rewards",
              path: "/admin/rewards",
              icon: <Gift className="w-4 h-4" />,
            },
          ],
        };
      default:
        return { primary: [], secondary: [] };
    }
  };

  const { primary: primaryNav, secondary: secondaryNav } = getNavConfig();
  const isActive = (path: string) => location.pathname === path;

  type NavItem = {
    label: string;
    path: string;
    icon: React.ReactNode;
    gradient?: boolean;
  };

  const NavLink = ({
    item,
    mobile = false,
  }: {
    item: NavItem;
    mobile?: boolean;
  }) => {
    const active = isActive(item.path);

    if (item.gradient && !active) {
      return (
        <Link
          to={item.path}
          onClick={() => mobile && setMobileMenuOpen(false)}
          className={`
            group relative flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm
            bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500
            text-white shadow-lg shadow-green-500/25
            hover:shadow-xl hover:shadow-green-500/30 hover:scale-105
            active:scale-95 transition-all duration-300
            ${mobile ? "w-full justify-center py-3" : ""}
          `}
        >
          {item.icon}
          <span>{item.label}</span>
          <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      );
    }

    return (
      <Link
        to={item.path}
        onClick={() => mobile && setMobileMenuOpen(false)}
        className={`
          relative flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm
          transition-all duration-300
          ${mobile ? "w-full justify-center py-3" : ""}
          ${
            active
              ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 shadow-inner"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-green-600 dark:hover:text-green-400"
          }
        `}
      >
        {item.icon}
        <span>{item.label}</span>
        {active && (
          <motion.div
            layoutId="activeNav"
            className="absolute inset-0 bg-green-100 dark:bg-green-900/40 rounded-full -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Link>
    );
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        {/* Glass morphism background */}
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50" />

        {/* Gradient accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

        <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-10 h-10"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/25" />
                <div className="absolute inset-0 rounded-xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
              </motion.div>
              <span className="text-xl font-heading font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                GreenLoop
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              {!isAuthenticated ? (
                // Public nav
                <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-100/50 dark:bg-slate-800/50 rounded-full">
                  <Link
                    to="/about"
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition font-medium text-sm rounded-full hover:bg-white dark:hover:bg-slate-700"
                  >
                    About
                  </Link>
                  <Link
                    to="/how-it-works"
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition font-medium text-sm rounded-full hover:bg-white dark:hover:bg-slate-700"
                  >
                    How It Works
                  </Link>
                </div>
              ) : (
                // Authenticated nav
                <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-100/50 dark:bg-slate-800/50 rounded-full">
                  {primaryNav.map((item) => (
                    <NavLink key={item.path} item={item} />
                  ))}

                  {/* More dropdown for secondary nav */}
                  {secondaryNav.length > 0 && (
                    <div className="relative group">
                      <button className="flex items-center gap-1 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition font-medium text-sm rounded-full hover:bg-white dark:hover:bg-slate-700">
                        More
                        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                      </button>
                      <div className="absolute top-full right-0 mt-2 w-48 py-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30 border border-gray-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        {secondaryNav.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                              isActive(item.path)
                                ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30"
                                : "text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-slate-700"
                            }`}
                          >
                            {item.icon}
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right side actions */}
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle variant="button" size="sm" />

              {isAuthenticated ? (
                <>
                  {/* Points display for Donor */}
                  {user?.role === "DONOR" && (
                    <Link to="/donor/wallet">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative flex items-center gap-2 px-4 py-2 overflow-hidden rounded-full cursor-pointer group"
                      >
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400" />
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Shine effect */}
                        <div className="absolute inset-0 opacity-30">
                          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                        </div>

                        <TrendingUp className="relative w-4 h-4 text-yellow-900" />
                        <span className="relative text-yellow-900 font-bold text-sm">
                          {user.points.toLocaleString()}
                        </span>
                        <Award className="relative w-4 h-4 text-yellow-900" />
                      </motion.div>
                    </Link>
                  )}

                  {/* Notification Bell */}
                  <NotificationBell />

                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-1 pr-3 bg-gray-100 dark:bg-slate-800 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <div className="relative">
                        <div className="w-9 h-9 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-green-500/20">
                          {user?.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" />
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                          userMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </motion.button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full right-0 mt-2 w-64 py-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30 border border-gray-100 dark:border-slate-700 overflow-hidden"
                        >
                          {/* User info header */}
                          <div className="px-4 py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 border-b border-gray-100 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {user?.fullName?.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-white truncate">
                                  {user?.fullName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {user?.email}
                                </p>
                                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                                  <Recycle className="w-3 h-3" />
                                  {user?.role}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Menu items */}
                          <div className="py-2">
                            <Link
                              to="/profile"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                            >
                              <User className="w-4 h-4" />
                              Profile Settings
                            </Link>
                            {user?.role === "DONOR" && (
                              <Link
                                to="/donor/wallet"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                              >
                                <Wallet className="w-4 h-4" />
                                Wallet & Points
                              </Link>
                            )}
                            <Link
                              to="/how-it-works"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                            >
                              <HelpCircle className="w-4 h-4" />
                              Help & Support
                            </Link>
                          </div>

                          {/* Logout */}
                          <div className="border-t border-gray-100 dark:border-slate-700 pt-2">
                            <button
                              onClick={() => {
                                logout();
                                setUserMenuOpen(false);
                              }}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="rounded-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-medium text-sm rounded-full shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-shadow"
                    >
                      Get Started
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 lg:hidden">
              {isAuthenticated && (
                <>
                  {user?.role === "DONOR" && (
                    <Link
                      to="/donor/wallet"
                      className="flex items-center gap-1 px-2 py-1 bg-yellow-400 rounded-full"
                    >
                      <Award className="w-3 h-3 text-yellow-900" />
                      <span className="text-xs font-bold text-yellow-900">
                        {user.points}
                      </span>
                    </Link>
                  )}
                  <NotificationBell />
                </>
              )}
              <ThemeToggle variant="button" size="sm" />
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-18" />

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-slate-900 z-50 lg:hidden overflow-y-auto"
            >
              {/* Close button */}
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-4 pb-8">
                {isAuthenticated ? (
                  <>
                    {/* User card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-4 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl text-white mb-6"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {user?.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-lg">{user?.fullName}</p>
                          <p className="text-green-100 text-sm">
                            {user?.email}
                          </p>
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-white/20 text-white text-xs font-medium rounded-full">
                            {user?.role}
                          </span>
                        </div>
                      </div>
                      {user?.role === "DONOR" && (
                        <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                          <span className="text-green-100">Your Points</span>
                          <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                            <Award className="w-4 h-4" />
                            <span className="font-bold">
                              {user.points.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>

                    {/* Primary nav */}
                    <div className="space-y-2 mb-6">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-3">
                        Quick Actions
                      </p>
                      {primaryNav.map((item, index) => (
                        <motion.div
                          key={item.path}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                        >
                          <NavLink item={item} mobile />
                        </motion.div>
                      ))}
                    </div>

                    {/* Secondary nav */}
                    {secondaryNav.length > 0 && (
                      <div className="space-y-2 mb-6">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-3">
                          More
                        </p>
                        {secondaryNav.map((item, index) => (
                          <motion.div
                            key={item.path}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                          >
                            <NavLink item={item} mobile />
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Settings links */}
                    <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-slate-800">
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-green-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Public mobile nav */}
                    <div className="space-y-2 mb-6">
                      <Link
                        to="/about"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-green-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 font-medium"
                      >
                        About
                      </Link>
                      <Link
                        to="/how-it-works"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-green-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 font-medium"
                      >
                        How It Works
                      </Link>
                    </div>

                    {/* Auth buttons */}
                    <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button variant="outline" className="w-full rounded-xl">
                          Sign In
                        </Button>
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="gradient"
                          className="w-full rounded-xl"
                        >
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
