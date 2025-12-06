import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Container } from "../../components/layout/Container";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { apiClient } from "../../lib/api-client";
import type { DonationRequest } from "../../types";
import {
  Search,
  Filter,
  X,
  AlertTriangle,
  Package,
  Calendar,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export const DonationHistoryPage = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] =
    useState<DonationRequest | null>(null);

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ["donations", "my"],
    queryFn: async () => {
      const response = await apiClient.get("/donation-requests/my-requests");
      return response.data.requests;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (donationId: string) => {
      const response = await apiClient.post(
        `/donation-requests/${donationId}/cancel`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Donation request cancelled successfully");
      setCancelModalOpen(false);
      setSelectedDonation(null);
      queryClient.invalidateQueries({ queryKey: ["donations", "my"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || "Failed to cancel donation request"
      );
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredDonations = donations.filter((donation: DonationRequest) => {
    const matchesStatus =
      statusFilter === "all" || donation.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      donation.wasteCategory?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      donation.address?.district
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      donation.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCancelClick = (donation: DonationRequest) => {
    setSelectedDonation(donation);
    setCancelModalOpen(true);
  };

  const confirmCancel = () => {
    if (selectedDonation) {
      cancelMutation.mutate(selectedDonation.id);
    }
  };

  const stats = {
    total: donations.length,
    pending: donations.filter((d: DonationRequest) => d.status === "PENDING")
      .length,
    accepted: donations.filter((d: DonationRequest) => d.status === "ACCEPTED")
      .length,
    completed: donations.filter(
      (d: DonationRequest) => d.status === "COMPLETED"
    ).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Donation History
          </h1>
          <p className="text-gray-600">
            View all your past and current donation requests
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-gray-500 to-gray-600 text-white">
            <div className="p-4">
              <p className="text-gray-200 text-xs">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <div className="p-4">
              <p className="text-yellow-100 text-xs">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="p-4">
              <p className="text-blue-100 text-xs">Accepted</p>
              <p className="text-2xl font-bold">{stats.accepted}</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="p-4">
              <p className="text-green-100 text-xs">Completed</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
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
                  placeholder="Search by category, district, or ID..."
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Donations List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading donations...</p>
          </div>
        ) : filteredDonations.length === 0 ? (
          <Card className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No donations found
              </h3>
              <p className="text-gray-600">
                {statusFilter !== "all"
                  ? "No donations match your filter criteria"
                  : "Start making a difference by creating your first donation"}
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredDonations.map(
              (donation: DonationRequest, index: number) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Card className="hover:shadow-lg transition-all">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {donation.wasteCategory?.name ||
                                "Unknown Category"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              ID: {donation.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0 flex items-center gap-2">
                          <Badge className={getStatusColor(donation.status)}>
                            {donation.status}
                          </Badge>
                          {/* Cancel Button - Only for PENDING and ACCEPTED */}
                          {(donation.status === "PENDING" ||
                            donation.status === "ACCEPTED") && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleCancelClick(donation)}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Verification Code for Accepted Requests */}
                      {donation.status === "ACCEPTED" &&
                        donation.collection?.verificationCode && (
                          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-full">
                                  <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-blue-900">
                                    Verification Code
                                  </h4>
                                  <p className="text-sm text-blue-700">
                                    Give this code to the collector when they
                                    arrive
                                  </p>
                                </div>
                              </div>
                              <div className="text-3xl font-mono font-bold text-blue-600 tracking-wider bg-white px-4 py-2 rounded border border-blue-100 shadow-sm">
                                {donation.collection.verificationCode}
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Weight</p>
                            <p className="text-sm font-medium text-gray-900">
                              {donation.actualWeight ||
                                donation.estimatedWeight}{" "}
                              kg
                              {!donation.actualWeight && " (est.)"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Created</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(donation.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                        </div>

                        {donation.collection?.pointsAwarded && (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <span className="text-green-600 font-bold text-xs">
                                PT
                              </span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                Points Earned
                              </p>
                              <p className="text-sm font-bold text-green-600">
                                +{donation.collection.pointsAwarded} pts
                              </p>
                            </div>
                          </div>
                        )}

                        {donation.preferredDate && (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                Preferred Date
                              </p>
                              <p className="text-sm font-medium text-gray-900">
                                {new Date(
                                  donation.preferredDate
                                ).toLocaleDateString("vi-VN")}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Address */}
                      {donation.address && (
                        <div className="flex items-start gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Collection Address
                            </p>
                            <p className="text-sm text-gray-700">
                              {donation.address.street}, {donation.address.ward}
                              , {donation.address.district},{" "}
                              {donation.address.city}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {donation.notes && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-1">Notes</p>
                          <p className="text-sm text-gray-700">
                            {donation.notes}
                          </p>
                        </div>
                      )}

                      {/* Collector Info */}
                      {donation.collection?.collector && (
                        <div className="border-t pt-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Collected by
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {donation.collection.collector.fullName ||
                              "Unknown Collector"}
                          </p>
                          {donation.collection.collectedAt && (
                            <p className="text-xs text-gray-600">
                              on{" "}
                              {new Date(
                                donation.collection.collectedAt
                              ).toLocaleString("vi-VN")}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Images */}
                      {donation.imageUrls && donation.imageUrls.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-500 mb-2">Images</p>
                          <div className="flex flex-wrap gap-2">
                            {donation.imageUrls.map(
                              (url: string, idx: number) => (
                                <img
                                  key={idx}
                                  src={url}
                                  alt={`Donation ${idx + 1}`}
                                  className="w-20 h-20 object-cover rounded border"
                                />
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )
            )}
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        <Modal
          isOpen={cancelModalOpen}
          onClose={() => {
            setCancelModalOpen(false);
            setSelectedDonation(null);
          }}
          title="Cancel Donation Request"
        >
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Are you sure?
                </h3>
                <p className="text-gray-600">This action cannot be undone.</p>
              </div>
            </div>

            {selectedDonation && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  You are about to cancel:
                </p>
                <p className="font-medium text-gray-900">
                  {selectedDonation.wasteCategory?.name} -{" "}
                  {selectedDonation.estimatedWeight} kg
                </p>
                <p className="text-sm text-gray-500">
                  Status: {selectedDonation.status}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setCancelModalOpen(false);
                  setSelectedDonation(null);
                }}
              >
                Keep Request
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                onClick={confirmCancel}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? "Cancelling..." : "Yes, Cancel"}
              </Button>
            </div>
          </div>
        </Modal>
      </Container>
    </div>
  );
};
