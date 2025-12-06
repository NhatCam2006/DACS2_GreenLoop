import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Container } from "../../components/layout/Container";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StatCard } from "../../components/ui/StatCard";
import { apiClient } from "../../lib/api-client";
import {
  Users,
  Package,
  Gift,
  Activity,
  ShoppingBag,
  UserCheck,
  ArrowRight,
  Settings,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export const AdminDashboard = () => {
  // Fetch dashboard stats with error handling
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const response = await apiClient.get("/users");
      return response.data.users;
    },
    retry: 1,
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["waste-categories"],
    queryFn: async () => {
      const response = await apiClient.get("/waste-categories");
      return response.data.categories;
    },
    retry: 1,
  });

  const { data: rewards, isLoading: rewardsLoading } = useQuery({
    queryKey: ["rewards"],
    queryFn: async () => {
      const response = await apiClient.get("/rewards");
      return response.data.rewards;
    },
    retry: 1,
  });

  const { data: donations, isLoading: donationsLoading } = useQuery({
    queryKey: ["admin", "donations"],
    queryFn: async () => {
      const response = await apiClient.get("/donation-requests");
      return response.data.requests;
    },
    retry: 1,
  });

  // Check if any data is loading
  const isLoading =
    usersLoading || categoriesLoading || rewardsLoading || donationsLoading;

  // Ensure data is array (API might return object or undefined)
  const usersList = Array.isArray(users) ? users : [];
  const categoriesList = Array.isArray(categories) ? categories : [];
  const rewardsList = Array.isArray(rewards) ? rewards : [];
  const donationsList = Array.isArray(donations) ? donations : [];

  // Calculate stats
  const totalUsers = usersList.length;
  const totalDonors = usersList.filter((u: any) => u.role === "DONOR").length;
  const totalCollectors = usersList.filter(
    (u: any) => u.role === "COLLECTOR"
  ).length;
  const totalCategories = categoriesList.length;
  const totalRewards = rewardsList.length;
  const totalDonations = donationsList.length;
  const pendingDonations = donationsList.filter(
    (d: any) => d.status === "PENDING"
  ).length;
  const completedDonations = donationsList.filter(
    (d: any) => d.status === "COMPLETED"
  ).length;

  const quickActions = [
    {
      title: "Manage Users",
      description: "View and manage all platform users",
      icon: Users,
      link: "/admin/users",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Waste Categories",
      description: "Add or edit waste categories and pricing",
      icon: ShoppingBag,
      link: "/admin/categories",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Manage Rewards",
      description: "Update rewards catalog and stock",
      icon: Gift,
      link: "/admin/rewards",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "View Donations",
      description: "Monitor all donation requests and collections",
      icon: Package,
      link: "/admin/donations",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <Container>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Show error state
  if (usersError) {
    return (
      <div className="py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <Container>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Package className="h-10 w-10 text-red-500" />
              </motion.div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Failed to load data
              </h2>
              <p className="text-gray-600 mb-4">
                Please check your connection and try again
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="gradient"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Container className="py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30"
            >
              <Shield className="w-7 h-7" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-500">Manage your GreenLoop platform</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={Users}
            gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
            delay={0}
          />
          <StatCard
            title="Donors"
            value={totalDonors}
            icon={UserCheck}
            gradient="bg-gradient-to-br from-green-500 to-emerald-600"
            delay={0.1}
          />
          <StatCard
            title="Collectors"
            value={totalCollectors}
            icon={Activity}
            gradient="bg-gradient-to-br from-purple-500 to-pink-600"
            delay={0.2}
          />
          <StatCard
            title="Total Donations"
            value={totalDonations}
            icon={Package}
            gradient="bg-gradient-to-br from-orange-500 to-red-500"
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Pending"
            value={pendingDonations}
            icon={Clock}
            gradient="bg-gradient-to-br from-yellow-500 to-orange-500"
            delay={0.4}
          />
          <StatCard
            title="Completed"
            value={completedDonations}
            icon={CheckCircle}
            gradient="bg-gradient-to-br from-teal-500 to-cyan-600"
            delay={0.5}
          />
          <StatCard
            title="Categories"
            value={totalCategories}
            icon={ShoppingBag}
            gradient="bg-gradient-to-br from-indigo-500 to-violet-600"
            delay={0.6}
          />
          <StatCard
            title="Rewards"
            value={totalRewards}
            icon={Gift}
            gradient="bg-gradient-to-br from-pink-500 to-rose-600"
            delay={0.7}
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.link}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index + 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      hover
                      glow
                      className="h-full border-2 border-transparent hover:border-indigo-100 transition-all group"
                    >
                      <div className="p-5">
                        <div
                          className={`inline-flex p-3 ${action.bgColor} rounded-xl mb-4 group-hover:shadow-lg transition-shadow`}
                        >
                          <Icon className={`h-6 w-6 ${action.color}`} />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1 flex items-center justify-between">
                          {action.title}
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                        </h3>
                        <p className="text-sm text-gray-500">
                          {action.description}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Recent Donations */}
          <Card variant="glass" className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Recent Donations
                  </h3>
                </div>
                <Link to="/admin/donations">
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    View All
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {donationsList
                  .slice(0, 5)
                  .map((donation: any, index: number) => (
                    <motion.div
                      key={donation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl hover:from-orange-50 hover:to-transparent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                          <Package className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {donation.wasteCategory?.name || "Unknown Category"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {donation.estimatedWeight}kg -{" "}
                            {donation.donor?.fullName}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          donation.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-600/20"
                            : donation.status === "ACCEPTED"
                            ? "bg-blue-100 text-blue-700 ring-1 ring-blue-600/20"
                            : donation.status === "COMPLETED"
                            ? "bg-green-100 text-green-700 ring-1 ring-green-600/20"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {donation.status}
                      </span>
                    </motion.div>
                  ))}
                {donationsList.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No recent donations</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Recent Users */}
          <Card variant="glass" className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Recent Users
                  </h3>
                </div>
                <Link to="/admin/users">
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    View All
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {usersList.slice(0, 5).map((user: any, index: number) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl hover:from-blue-50 hover:to-transparent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                          user.role === "DONOR"
                            ? "bg-gradient-to-br from-green-500 to-emerald-600"
                            : user.role === "COLLECTOR"
                            ? "bg-gradient-to-br from-purple-500 to-pink-600"
                            : "bg-gradient-to-br from-blue-500 to-indigo-600"
                        }`}
                      >
                        {user.fullName?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.fullName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.role === "DONOR"
                          ? "bg-green-100 text-green-700 ring-1 ring-green-600/20"
                          : user.role === "COLLECTOR"
                          ? "bg-purple-100 text-purple-700 ring-1 ring-purple-600/20"
                          : "bg-blue-100 text-blue-700 ring-1 ring-blue-600/20"
                      }`}
                    >
                      {user.role}
                    </span>
                  </motion.div>
                ))}
                {usersList.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No users found</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};
