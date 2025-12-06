import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Container } from "../../components/layout/Container";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StatCard } from "../../components/ui/StatCard";
import { useAuthStore } from "../../stores/auth.store";
import { apiClient } from "../../lib/api-client";
import {
  Search,
  ClipboardList,
  History,
  Package,
  Clock,
  CheckCircle,
  TrendingUp,
  MapPin,
  ArrowRight,
  Sparkles,
  User,
} from "lucide-react";
import type { DonationRequest } from "../../types";

export const CollectorDashboard = () => {
  const { user } = useAuthStore();

  // Fetch available donation requests
  const { data: availableRequests = [], isLoading: loadingAvailable } =
    useQuery({
      queryKey: ["donation-requests", "available"],
      queryFn: async () => {
        const response = await apiClient.get<{ requests: DonationRequest[] }>(
          "/donation-requests?status=PENDING"
        );
        return response.data.requests;
      },
    });

  // Fetch collector's accepted requests
  const { data: myCollections = [], isLoading: loadingMy } = useQuery({
    queryKey: ["collections", "my"],
    queryFn: async () => {
      const response = await apiClient.get<{ requests: DonationRequest[] }>(
        "/donation-requests/my-collections"
      );
      return response.data.requests;
    },
  });

  const stats = {
    available: availableRequests.length,
    accepted: myCollections.filter((c) => c.status === "ACCEPTED").length,
    completed: myCollections.filter((c) => c.status === "COMPLETED").length,
    total: myCollections.length,
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
              className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/30"
            >
              🚚
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user?.fullName}!
              </h1>
              <p className="text-gray-500">
                Manage your collections and help make a difference
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Available Requests"
            value={stats.available}
            icon={Package}
            gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
            delay={0}
          />
          <StatCard
            title="Accepted"
            value={stats.accepted}
            icon={Clock}
            gradient="bg-gradient-to-br from-yellow-500 to-orange-500"
            delay={0.1}
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle}
            gradient="bg-gradient-to-br from-green-500 to-emerald-600"
            delay={0.2}
          />
          <StatCard
            title="Total Collections"
            value={stats.total}
            icon={TrendingUp}
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
          <Link to="/collector/available" className="block group">
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
                  <Search className="w-8 h-8 text-blue-600" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Browse Requests
                </h3>
                <p className="text-sm text-gray-600">
                  Find available donations
                </p>
              </div>
            </Card>
          </Link>

          <Link to="/collector/my-collections" className="block group">
            <Card
              hover
              glow
              className="h-full border-2 border-transparent hover:border-green-200 transition-all"
            >
              <div className="p-6 text-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-green-500/20 transition-shadow"
                >
                  <ClipboardList className="w-8 h-8 text-green-600" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  My Collections
                </h3>
                <p className="text-sm text-gray-600">Manage your pickups</p>
              </div>
            </Card>
          </Link>

          <Link to="/collector/history" className="block group">
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
                  <History className="w-8 h-8 text-purple-600" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  History
                </h3>
                <p className="text-sm text-gray-600">View past collections</p>
              </div>
            </Card>
          </Link>
        </motion.div>

        {/* Recent Available Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="glass" className="mb-8 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Available Requests
                  </h2>
                </div>
                <Link to="/collector/available">
                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    View All
                  </Button>
                </Link>
              </div>

              {loadingAvailable ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                  <p className="text-gray-500 mt-3">Loading requests...</p>
                </div>
              ) : availableRequests.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Sparkles className="w-10 h-10 text-blue-600" />
                  </motion.div>
                  <p className="text-gray-600 text-lg">
                    No available requests at the moment
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Check back later for new donations!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableRequests.slice(0, 5).map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl hover:from-blue-50 hover:to-transparent transition-all group"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {request.wasteCategory?.name || "Unknown"}
                          </h4>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="font-medium">
                              {request.estimatedWeight} kg
                            </span>
                            <span className="text-gray-400">•</span>
                            <MapPin className="w-3 h-3 text-gray-400" />
                            {request.address?.district}, {request.address?.city}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(request.createdAt).toLocaleDateString(
                              "vi-VN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <Link to={`/collector/request/${request.id}`}>
                        <Button
                          size="sm"
                          variant="gradient"
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                          View
                        </Button>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* My Active Collections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card variant="glass" className="overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Active Collections
                  </h2>
                </div>
                <Link to="/collector/my-collections">
                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    View All
                  </Button>
                </Link>
              </div>

              {loadingMy ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent mx-auto"></div>
                  <p className="text-gray-500 mt-3">Loading collections...</p>
                </div>
              ) : myCollections.filter((c) => c.status === "ACCEPTED")
                  .length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <ClipboardList className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <p className="text-gray-600 text-lg">No active collections</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Accept a request to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myCollections
                    .filter((c) => c.status === "ACCEPTED")
                    .slice(0, 5)
                    .map((request, index) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-transparent rounded-xl hover:from-green-100 hover:to-transparent transition-all"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {request.wasteCategory?.name || "Unknown"}
                            </h4>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="font-medium">
                                {request.estimatedWeight} kg
                              </span>
                              <span className="text-gray-400">•</span>
                              <User className="w-3 h-3 text-gray-400" />
                              {request.donor?.fullName}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Accepted on{" "}
                              {new Date(request.updatedAt).toLocaleDateString(
                                "vi-VN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <Link to={`/collector/collection/${request.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-200 text-green-700 hover:bg-green-50"
                          >
                            Complete
                          </Button>
                        </Link>
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
