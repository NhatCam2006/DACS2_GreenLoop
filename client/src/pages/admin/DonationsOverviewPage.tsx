import { useQuery } from "@tanstack/react-query";
import { Container } from "../../components/layout/Container";
import { Card } from "../../components/ui/Card";
import { apiClient } from "../../lib/api-client";
import { Package, MapPin, User, Calendar, Weight } from "lucide-react";
import { format } from "date-fns";

export const DonationsOverviewPage = () => {
  const { data: donations, isLoading } = useQuery({
    queryKey: ["admin", "donations"],
    queryFn: async () => {
      const response = await apiClient.get("/donation-requests");
      return response.data.requests;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Ensure donations is an array
  const donationsList = Array.isArray(donations) ? donations : [];

  const stats = [
    {
      label: "Total Donations",
      value: donationsList.length,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Pending",
      value: donationsList.filter((d: any) => d.status === "PENDING").length,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      label: "Accepted",
      value: donationsList.filter((d: any) => d.status === "ACCEPTED").length,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Completed",
      value: donationsList.filter((d: any) => d.status === "COMPLETED").length,
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Donations Overview
          </h1>
          <p className="text-lg text-gray-600">
            Monitor all donation requests and collections
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0">
              <div
                className={`p-6 bg-gradient-to-br ${stat.color} rounded-lg text-white`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm font-medium opacity-90">
                      {stat.label}
                    </div>
                  </div>
                  <Package className="h-8 w-8 opacity-75" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Donations List */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              All Donation Requests
            </h2>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading donations...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {donationsList.map((donation: any) => (
                  <div
                    key={donation.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Donation Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="h-5 w-5 text-gray-400" />
                          <span className="font-semibold text-gray-900">
                            {donation.wasteCategory?.name || "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Weight className="h-4 w-4" />
                          <span>Est: {donation.estimatedWeight}kg</span>
                        </div>
                        {donation.collection?.actualWeight && (
                          <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                            <Weight className="h-4 w-4" />
                            <span>
                              Actual: {donation.collection.actualWeight}kg
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Donor Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {donation.donor?.fullName || "Unknown Donor"}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {donation.donor?.email}
                        </div>
                      </div>

                      {/* Collector Info */}
                      <div>
                        {donation.collector ? (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-5 w-5 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {donation.collector.fullName}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Collector
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-500 italic">
                            No collector assigned
                          </div>
                        )}
                      </div>

                      {/* Status & Date */}
                      <div className="flex flex-col items-end justify-between">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            donation.status
                          )}`}
                        >
                          {donation.status}
                        </span>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(
                              new Date(donation.createdAt),
                              "MMM dd, yyyy"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    {donation.address && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>
                            {donation.address.street}
                            {donation.address.ward &&
                              `, ${donation.address.ward}`}
                            {donation.address.district &&
                              `, ${donation.address.district}`}
                            {donation.address.city &&
                              `, ${donation.address.city}`}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {donation.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Notes:</span>{" "}
                          {donation.notes}
                        </p>
                      </div>
                    )}

                    {/* Collection Info */}
                    {donation.collection && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {donation.collection.verificationNote && (
                            <div>
                              <span className="font-medium text-gray-700">
                                Verification Note:
                              </span>
                              <p className="text-gray-600">
                                {donation.collection.verificationNote}
                              </p>
                            </div>
                          )}
                          {donation.collection.pointsEarned > 0 && (
                            <div className="text-right">
                              <span className="font-semibold text-green-600">
                                +{donation.collection.pointsEarned} points
                                earned
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {donationsList.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No donation requests found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
};
