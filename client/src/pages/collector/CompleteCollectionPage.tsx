import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Container } from "../../components/layout/Container";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { apiClient } from "../../lib/api-client";
import toast from "react-hot-toast";

export const CompleteCollectionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    actualWeight: "",
    verificationNotes: "",
    verificationCode: "",
    verificationImages: [] as string[],
  });

  const { data: request, isLoading } = useQuery({
    queryKey: ["donation-request", id],
    queryFn: async () => {
      const response = await apiClient.get(`/donation-requests/${id}`);
      return response.data.request;
    },
    enabled: !!id,
  });

  const completeMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiClient.post(
        `/donation-requests/${id}/complete`,
        {
          actualWeight: parseFloat(data.actualWeight),
          verificationNotes: data.verificationNotes || undefined,
          verificationImages: data.verificationImages,
          verificationCode: data.verificationCode,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Collection completed successfully!");
      queryClient.invalidateQueries({ queryKey: ["donation-requests"] });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      navigate("/collector/my-collections");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || "Failed to complete collection"
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.actualWeight) {
      toast.error("Please enter the actual weight");
      return;
    }

    if (!formData.verificationCode || formData.verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit verification code");
      return;
    }

    completeMutation.mutate(formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculatedPoints =
    request && formData.actualWeight
      ? Math.round(
          (request.wasteCategory?.pointsPerKg || 0) *
            parseFloat(formData.actualWeight)
        )
      : 0;

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading collection details...</p>
        </div>
      </Container>
    );
  }

  if (!request) {
    return (
      <Container className="py-8">
        <Card className="text-center py-12">
          <p className="text-gray-600">Collection not found</p>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Collection
          </h1>
          <p className="text-gray-600">
            Verify and complete this donation collection
          </p>
        </div>

        {/* Request Details */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {request.wasteCategory?.name || "Unknown Category"}
                </h2>
                <p className="text-sm text-gray-600">
                  Donor: {request.donor?.fullName || "Unknown"}
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                {request.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Estimated Weight</p>
                <p className="text-lg font-medium text-gray-900">
                  {request.estimatedWeight} kg
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Points per kg</p>
                <p className="text-lg font-medium text-green-600">
                  {request.wasteCategory?.pointsPerKg || 0} pts/kg
                </p>
              </div>

              {request.address && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">
                    Collection Address
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {request.address.street}, {request.address.ward},{" "}
                    {request.address.district}, {request.address.city}
                  </p>
                </div>
              )}

              {request.notes && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Donor Notes</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {request.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Completion Form */}
        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code (OTP) <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleInputChange}
                placeholder="Enter the 6-digit code from donor"
                maxLength={6}
                required
                className="font-mono tracking-widest text-center text-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ask the donor for the verification code to confirm collection
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actual Weight (kg) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                name="actualWeight"
                value={formData.actualWeight}
                onChange={handleInputChange}
                placeholder="Enter the actual weight collected"
                step="0.1"
                min="0.1"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This should be the verified weight after collection
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Notes
              </label>
              <textarea
                name="verificationNotes"
                value={formData.verificationNotes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Any observations, issues, or notes about the collection..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Image URL
              </label>
              <Input
                type="url"
                placeholder="https://example.com/verification-image.jpg"
                onChange={(e) => {
                  if (e.target.value) {
                    setFormData((prev) => ({
                      ...prev,
                      verificationImages: [e.target.value],
                    }));
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload a photo of the collected waste for verification
              </p>
            </div>

            {/* Points Calculation */}
            {formData.actualWeight && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">
                    Points to Award:
                  </span>
                  <span className="text-3xl font-bold text-green-600">
                    {calculatedPoints} pts
                  </span>
                </div>
                <div className="text-xs text-green-700 space-y-1">
                  <p>
                    Calculation: {formData.actualWeight} kg ×{" "}
                    {request.wasteCategory?.pointsPerKg || 0} pts/kg ={" "}
                    {calculatedPoints} pts
                  </p>
                  <p className="font-medium">
                    This amount will be credited to the donor's account
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={completeMutation.isPending}
              >
                {completeMutation.isPending
                  ? "Completing..."
                  : "Complete Collection"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/collector/my-collections")}
                disabled={completeMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Container>
  );
};
