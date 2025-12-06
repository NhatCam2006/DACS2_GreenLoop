import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Container } from "../../components/layout/Container";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { apiClient } from "../../lib/api-client";
import type { DonationRequest } from "../../types";
import {
  Search,
  Package,
  MapPin,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";

export const MyCollectionsPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["my-collections"],
    queryFn: async () => {
      const response = await apiClient.get("/donation-requests/my-collections");
      return response.data.requests;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredCollections = collections.filter(
    (collection: DonationRequest) => {
      const matchesStatus =
        statusFilter === "all" || collection.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        collection.wasteCategory?.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        collection.donor?.fullName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        collection.address?.district
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    }
  );

  const stats = {
    total: collections.length,
    accepted: collections.filter(
      (c: DonationRequest) => c.status === "ACCEPTED"
    ).length,
    completed: collections.filter(
      (c: DonationRequest) => c.status === "COMPLETED"
    ).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Collections
          </h1>
          <p className="text-gray-600">
            Manage your accepted and completed collections
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Collections</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Package className="w-10 h-10 text-purple-200" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">In Progress</p>
                  <p className="text-3xl font-bold">{stats.accepted}</p>
                </div>
                <Clock className="w-10 h-10 text-blue-200" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Completed</p>
                  <p className="text-3xl font-bold">{stats.completed}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-200" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-6 p-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <Input
                  placeholder="Search by category, donor, or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                />
              </div>

              <div className="w-full md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="ACCEPTED">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Collections List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading collections...</p>
          </div>
        ) : filteredCollections.length === 0 ? (
          <Card className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-purple-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No collections found
              </h3>
              <p className="text-gray-600 mb-4">
                {statusFilter !== "all"
                  ? "No collections match your filter criteria"
                  : "Start accepting donation requests to see them here"}
              </p>
              <Link to="/collector/available">
                <Button>Browse Available Requests</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredCollections.map(
              (collection: DonationRequest, index: number) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Card className="hover:shadow-lg transition-all">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Left: Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                              <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {collection.wasteCategory?.name || "Unknown"}
                              </h3>
                              <p className="text-sm text-gray-500">
                                ID: {collection.id.slice(0, 8)}...
                              </p>
                            </div>
                            <Badge
                              className={getStatusColor(collection.status)}
                            >
                              {collection.status === "ACCEPTED"
                                ? "In Progress"
                                : collection.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            {/* Donor Info */}
                            <div className="flex items-start gap-2">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Phone className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Donor</p>
                                <p className="font-medium text-gray-900">
                                  {collection.donor?.fullName || "Unknown"}
                                </p>
                                <p className="text-gray-600">
                                  {collection.donor?.phone || "No phone"}
                                </p>
                              </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Address</p>
                                <p className="font-medium text-gray-900">
                                  {collection.address?.district || "Unknown"}
                                </p>
                                <p className="text-gray-600 text-xs line-clamp-1">
                                  {collection.address?.street}
                                </p>
                              </div>
                            </div>

                            {/* Weight & Points */}
                            <div className="flex items-start gap-2">
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-4 h-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Weight</p>
                                <p className="font-medium text-gray-900">
                                  {collection.actualWeight ||
                                    collection.estimatedWeight}{" "}
                                  kg
                                  {!collection.actualWeight && " (est.)"}
                                </p>
                                {collection.collection?.pointsAwarded && (
                                  <p className="text-green-600 font-medium">
                                    +{collection.collection.pointsAwarded} pts
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Action Button */}
                        <div className="flex items-center gap-3">
                          {collection.status === "ACCEPTED" && (
                            <Link to={`/collector/collection/${collection.id}`}>
                              <Button className="flex items-center gap-2">
                                Complete Collection
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </Link>
                          )}
                          {collection.status === "COMPLETED" && (
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-medium">Completed</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Collection Details */}
                      {collection.collection?.collectedAt && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-500">
                            Collected on{" "}
                            <span className="font-medium text-gray-700">
                              {new Date(
                                collection.collection.collectedAt
                              ).toLocaleString("vi-VN")}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )
            )}
          </div>
        )}
      </Container>
    </div>
  );
};
