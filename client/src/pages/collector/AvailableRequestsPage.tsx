import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Container } from "../../components/layout/Container";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Map } from "../../components/ui/Map";
import { apiClient } from "../../lib/api-client";
import type { DonationRequest } from "../../types";
import toast from "react-hot-toast";
import { useState } from "react";
import { Search, LayoutList, Map as MapIcon } from "lucide-react";

export const AvailableRequestsPage = () => {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] =
    useState<DonationRequest | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [filters, setFilters] = useState({
    district: "",
    wasteCategoryId: "",
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["waste-categories"],
    queryFn: async () => {
      const response = await apiClient.get("/waste-categories");
      return response.data.categories;
    },
  });

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["donation-requests", "available", filters],
    queryFn: async () => {
      const params = new URLSearchParams({ status: "PENDING" });
      if (filters.district) params.append("district", filters.district);
      if (filters.wasteCategoryId)
        params.append("wasteCategoryId", filters.wasteCategoryId);

      const response = await apiClient.get(
        `/donation-requests?${params.toString()}`
      );
      return response.data.requests;
    },
  });

  const acceptMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const response = await apiClient.post(
        `/donation-requests/${requestId}/accept`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Request accepted successfully!");
      setSelectedRequest(null);
      queryClient.invalidateQueries({ queryKey: ["donation-requests"] });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to accept request");
    },
  });

  const handleAccept = (request: DonationRequest) => {
    setSelectedRequest(request);
  };

  const confirmAccept = () => {
    if (selectedRequest) {
      acceptMutation.mutate(selectedRequest.id);
    }
  };

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Available Requests
        </h1>
        <p className="text-gray-600">
          Browse and accept donation requests near you
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              District
            </label>
            <Input
              placeholder="Filter by district..."
              value={filters.district}
              onChange={(e) =>
                setFilters({ ...filters, district: e.target.value })
              }
              leftIcon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Waste Category
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.wasteCategoryId}
              onChange={(e) =>
                setFilters({ ...filters, wasteCategoryId: e.target.value })
              }
            >
              <option value="">All Categories</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-auto flex gap-2 items-center">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-white shadow text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="List View"
              >
                <LayoutList className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "map"
                    ? "bg-white shadow text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Map View"
              >
                <MapIcon className="w-5 h-5" />
              </button>
            </div>
            <Button
              variant="outline"
              onClick={() => setFilters({ district: "", wasteCategoryId: "" })}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <Card className="text-center py-12">
          <div className="max-w-md mx-auto">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No requests available
            </h3>
            <p className="text-gray-600">
              Check back later for new donation requests
            </p>
          </div>
        </Card>
      ) : viewMode === "map" ? (
        <Card className="p-4 h-[600px]">
          <Map
            markers={requests
              .filter((r: any) => r.address?.latitude && r.address?.longitude)
              .map((r: any) => ({
                id: r.id,
                lat: r.address.latitude!,
                lng: r.address.longitude!,
                title: `${r.wasteCategory?.name || "Waste"} (${
                  r.estimatedWeight
                }kg)`,
                description:
                  r.address.street +
                  (r.address.district ? `, ${r.address.district}` : ""),
              }))}
            className="h-full w-full rounded-lg z-0"
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {requests.map((request: DonationRequest) => (
            <Card
              key={request.id}
              className="hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {request.wasteCategory?.name || "Unknown Category"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      By {request.donor?.fullName || "Unknown Donor"}
                    </p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    {request.status}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">
                      Estimated Weight
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {request.estimatedWeight} kg
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">
                      Estimated Points
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {Math.round(
                        (request.wasteCategory?.pointsPerKg || 0) *
                          request.estimatedWeight
                      )}{" "}
                      pts
                    </span>
                  </div>

                  {request.address && (
                    <div className="py-2">
                      <p className="text-sm text-gray-600 mb-1">
                        Collection Address
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {request.address.street}
                      </p>
                      <p className="text-sm text-gray-700">
                        {request.address.ward}, {request.address.district},{" "}
                        {request.address.city}
                      </p>
                    </div>
                  )}

                  {request.preferredDate && (
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-gray-600">
                        Preferred Date
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(request.preferredDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {request.notes && (
                    <div className="py-2">
                      <p className="text-sm text-gray-600 mb-1">Notes</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {request.notes}
                      </p>
                    </div>
                  )}

                  {request.imageUrls && request.imageUrls.length > 0 && (
                    <div className="py-2">
                      <p className="text-sm text-gray-600 mb-2">Images</p>
                      <div className="grid grid-cols-3 gap-2">
                        {request.imageUrls.map((url: string, index: number) => (
                          <img
                            key={index}
                            src={url}
                            alt={`Waste ${index + 1}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2 text-xs text-gray-500">
                    <span>Request ID: {request.id.slice(0, 8)}...</span>
                    <span>
                      Posted {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => handleAccept(request)}
                  disabled={acceptMutation.isPending}
                >
                  Accept Request
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Confirm Acceptance
              </h3>

              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to accept this collection request?
                </p>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Category:</span>
                    <span className="text-sm font-medium">
                      {selectedRequest.wasteCategory?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Weight:</span>
                    <span className="text-sm font-medium">
                      {selectedRequest.estimatedWeight} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="text-sm font-medium">
                      {selectedRequest.address?.district},{" "}
                      {selectedRequest.address?.city}
                    </span>
                  </div>
                </div>

                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    Once accepted, you'll be responsible for collecting this
                    donation. Make sure you can complete the collection.
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  className="flex-1"
                  onClick={confirmAccept}
                  disabled={acceptMutation.isPending}
                >
                  {acceptMutation.isPending ? "Accepting..." : "Confirm"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedRequest(null)}
                  disabled={acceptMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Container>
  );
};
