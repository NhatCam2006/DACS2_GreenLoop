import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Container } from "../../components/layout/Container";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StatCard } from "../../components/ui/StatCard";
import { useUser } from "../../hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../lib/api-client";
import {
  Award,
  Package,
  Clock,
  CheckCircle,
  Plus,
  Gift,
  History,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { DonationRequest, Transaction } from "../../types";

export const DonorDashboard = () => {
  const { user } = useUser();

  // Fetch recent donations
  const { data: donations = [], isLoading: loadingDonations } = useQuery({
    queryKey: ["donations", "my"],
    queryFn: async () => {
      const response = await apiClient.get<{ requests: DonationRequest[] }>(
        "/donation-requests/my-requests"
      );
      return response.data.requests;
    },
  });

  // Fetch recent transactions
  const { data: transactions = [], isLoading: loadingTransactions } = useQuery({
    queryKey: ["transactions", "my"],
    queryFn: async () => {
      const response = await apiClient.get<{ transactions: Transaction[] }>(
        "/transactions/my-transactions?limit=5"
      );
      return response.data.transactions;
    },
  });

  const stats = {
    totalDonations: donations.length,
    pendingDonations: donations.filter((d) => d.status === "PENDING").length,
    completedDonations: donations.filter((d) => d.status === "COMPLETED")
      .length,
    totalPoints: user?.points || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Container className="py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-green-500/30"
            >
              👋
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.fullName}!
              </h1>
              <p className="text-gray-500">
                Manage your donations and track your impact
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Points"
            value={stats.totalPoints}
            icon={Award}
            gradient="bg-gradient-to-br from-green-500 to-emerald-600"
            delay={0}
          />
          <StatCard
            title="Total Donations"
            value={stats.totalDonations}
            icon={Package}
            gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
            delay={0.1}
          />
          <StatCard
            title="Pending"
            value={stats.pendingDonations}
            icon={Clock}
            gradient="bg-gradient-to-br from-yellow-500 to-orange-500"
            delay={0.2}
          />
          <StatCard
            title="Completed"
            value={stats.completedDonations}
            icon={CheckCircle}
            gradient="bg-gradient-to-br from-purple-500 to-pink-600"
            delay={0.3}
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Link to="/donor/new-donation" className="block group">
            <Card
              hover
              glow
              className="h-full border-2 border-transparent hover:border-green-200 transition-all"
            >
              <div className="p-6 text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-green-500/20 transition-shadow"
                >
                  <Plus className="w-8 h-8 text-green-600" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  New Donation
                </h3>
                <p className="text-sm text-gray-600">
                  Schedule a waste collection
                </p>
              </div>
            </Card>
          </Link>

          <Link to="/donor/rewards" className="block group">
            <Card
              hover
              glow
              className="h-full border-2 border-transparent hover:border-purple-200 transition-all"
            >
              <div className="p-6 text-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-shadow"
                >
                  <Gift className="w-8 h-8 text-purple-600" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Redeem Rewards
                </h3>
                <p className="text-sm text-gray-600">Use your points</p>
              </div>
            </Card>
          </Link>

          <Link to="/donor/history" className="block group">
            <Card
              hover
              glow
              className="h-full border-2 border-transparent hover:border-blue-200 transition-all"
            >
              <div className="p-6 text-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-shadow"
                >
                  <History className="w-8 h-8 text-blue-600" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  History
                </h3>
                <p className="text-sm text-gray-600">View past donations</p>
              </div>
            </Card>
          </Link>
        </motion.div>

        {/* Recent Donations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="glass" className="mb-8 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Recent Donations
                  </h2>
                </div>
                <Link to="/donor/history">
                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    View All
                  </Button>
                </Link>
              </div>

              {loadingDonations ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent mx-auto"></div>
                  <p className="text-gray-500 mt-3">Loading donations...</p>
                </div>
              ) : donations.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Sparkles className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <p className="text-gray-600 mb-4 text-lg">
                    Start your recycling journey!
                  </p>
                  <Link to="/donor/new-donation">
                    <Button
                      variant="gradient"
                      leftIcon={<Plus className="w-4 h-4" />}
                    >
                      Create Your First Donation
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Weight
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Points
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {donations.slice(0, 5).map((donation, index) => (
                        <motion.tr
                          key={donation.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-colors"
                        >
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">
                            {donation.wasteCategory?.name || "Unknown"}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            <span className="font-semibold">
                              {donation.actualWeight ||
                                donation.estimatedWeight}
                            </span>{" "}
                            kg
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                                donation.status === "COMPLETED"
                                  ? "bg-green-100 text-green-700 ring-1 ring-green-600/20"
                                  : donation.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-600/20"
                                  : donation.status === "ACCEPTED"
                                  ? "bg-blue-100 text-blue-700 ring-1 ring-blue-600/20"
                                  : "bg-red-100 text-red-700 ring-1 ring-red-600/20"
                              }`}
                            >
                              {donation.status === "COMPLETED" && (
                                <CheckCircle className="w-3 h-3" />
                              )}
                              {donation.status === "PENDING" && (
                                <Clock className="w-3 h-3" />
                              )}
                              {donation.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`text-sm font-bold ${
                                donation.collection?.pointsAwarded
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {donation.collection?.pointsAwarded
                                ? `+${donation.collection.pointsAwarded}`
                                : "-"}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card variant="glass" className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Transactions
                </h2>
              </div>

              {loadingTransactions ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent mx-auto"></div>
                  <p className="text-gray-500 mt-3">Loading transactions...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Award className="w-10 h-10 text-purple-600" />
                  </motion.div>
                  <p className="text-gray-600 text-lg">No transactions yet</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Complete donations to earn points!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.02] ${
                        transaction.type === "EARN"
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100"
                          : "bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                            transaction.type === "EARN"
                              ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30"
                              : "bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-500/30"
                          }`}
                        >
                          {transaction.type === "EARN" ? (
                            <Plus className="w-5 h-5 text-white" />
                          ) : (
                            <Gift className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString(
                              "vi-VN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-base font-bold px-4 py-2 rounded-full ${
                          transaction.type === "EARN"
                            ? "text-green-700 bg-green-100"
                            : "text-purple-700 bg-purple-100"
                        }`}
                      >
                        {transaction.type === "EARN" ? "+" : "-"}
                        {transaction.amount} pts
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};
