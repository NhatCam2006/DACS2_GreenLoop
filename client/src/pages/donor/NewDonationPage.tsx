import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Container } from "../../components/layout/Container";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { apiClient } from "../../lib/api-client";
import toast from "react-hot-toast";
import { Upload, X, Plus } from "lucide-react";
import { LocationPicker } from "../../components/ui/LocationPicker";

export const NewDonationPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState<{
    street: string;
    ward: string;
    district: string;
    city: string;
    latitude?: number;
    longitude?: number;
  }>({
    street: "",
    ward: "",
    district: "",
    city: "Da Nang", // Default city
  });

  const [formData, setFormData] = useState({
    wasteCategoryId: "",
    estimatedWeight: "",
    addressId: "",
    notes: "",
    preferredDate: "",
    imageUrls: [] as string[],
  });

  // Fetch waste categories
  const {
    data: categories,
    isLoading: loadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["waste-categories"],
    queryFn: async () => {
      const response = await apiClient.get("/waste-categories");
      return response.data.categories;
    },
  });

  // Fetch user addresses
  const {
    data: addresses,
    isLoading: loadingAddresses,
    error: addressesError,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const response = await apiClient.get("/addresses");
      return response.data.addresses;
    },
  });

  // Ensure data is array
  const categoriesList = Array.isArray(categories) ? categories : [];
  const addressesList = Array.isArray(addresses) ? addresses : [];

  const createAddress = useMutation({
    mutationFn: async (
      data: typeof newAddress & { latitude?: number; longitude?: number }
    ) => {
      const response = await apiClient.post("/addresses", data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address added successfully");
      setIsAddressModalOpen(false);
      // Auto-select the new address
      setFormData((prev) => ({ ...prev, addressId: data.address.id }));
      // Reset form
      setNewAddress({
        street: "",
        ward: "",
        district: "",
        city: "Da Nang",
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to add address");
    },
  });

  // Create donation mutation
  const createDonation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Prepare data for API
      const payload: any = {
        wasteCategoryId: data.wasteCategoryId,
        estimatedWeight: parseFloat(data.estimatedWeight),
        addressId: data.addressId,
      };

      // Add optional fields if provided
      if (data.notes) {
        payload.notes = data.notes;
      }

      // Convert date to datetime if provided
      if (data.preferredDate) {
        payload.preferredDate = new Date(data.preferredDate).toISOString();
      }

      // Add imageUrls only if not empty
      if (data.imageUrls && data.imageUrls.length > 0) {
        payload.imageUrls = data.imageUrls;
      }

      const response = await apiClient.post("/donation-requests", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Donation request created successfully!");
      navigate("/donor/dashboard");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to create donation";
      toast.error(message);
      console.error("Donation creation error:", error.response?.data);
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await apiClient.post(
        "/upload?folder=donations",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, response.data.imageUrl],
      }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.wasteCategoryId ||
      !formData.estimatedWeight ||
      !formData.addressId
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    createDonation.mutate(formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Show loading state
  if (loadingCategories || loadingAddresses) {
    return (
      <Container className="py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading form data...</p>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // Show error state
  if (categoriesError || addressesError) {
    return (
      <Container className="py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to load form data
            </h2>
            <p className="text-gray-600 mb-4">
              Please check your connection and try again
            </p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            New Donation Request
          </h1>
          <p className="text-gray-600">
            Schedule a waste collection and earn points
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Waste Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Waste Category <span className="text-red-500">*</span>
              </label>
              {loadingCategories ? (
                <div className="text-sm text-gray-500">
                  Loading categories...
                </div>
              ) : (
                <select
                  name="wasteCategoryId"
                  value={formData.wasteCategoryId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categoriesList.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.pointsPerKg} pts/kg)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Estimated Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Weight (kg) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                name="estimatedWeight"
                value={formData.estimatedWeight}
                onChange={handleInputChange}
                placeholder="e.g., 5.5"
                step="0.1"
                min="0.1"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection Address <span className="text-red-500">*</span>
              </label>
              {loadingAddresses ? (
                <div className="text-sm text-gray-500">
                  Loading addresses...
                </div>
              ) : addressesList.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg
                      className="h-5 w-5 text-yellow-400 mt-0.5 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-yellow-800 mb-1">
                        No Collection Address
                      </h3>
                      <p className="text-sm text-yellow-700 mb-3">
                        You need to add at least one address before creating a
                        donation request.
                      </p>
                      <Button
                        type="button"
                        onClick={() => setIsAddressModalOpen(true)}
                        size="sm"
                        variant="outline"
                        className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                      >
                        Add Address
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <select
                    name="addressId"
                    value={formData.addressId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select an address</option>
                    {addressesList.map((address: any) => (
                      <option key={address.id} value={address.id}>
                        {address.street}, {address.ward}, {address.district},{" "}
                        {address.city}
                        {address.isPrimary && " (Primary)"}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddressModalOpen(true)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 p-0 h-auto font-normal"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add new address
                  </Button>
                </div>
              )}
            </div>

            {/* Preferred Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Collection Date
              </label>
              <Input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Any special instructions or details about your donation..."
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos (Optional)
              </label>

              <div className="space-y-4">
                {/* Image Preview Grid */}
                {formData.imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {formData.imageUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
                      >
                        <img
                          src={url}
                          alt={`Uploaded ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2"></div>
                      ) : (
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      )}
                      <p className="text-sm text-gray-500">
                        {isUploading ? "Uploading..." : "Click to upload photo"}
                      </p>
                      <p className="text-xs text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Estimated Points */}
            {formData.wasteCategoryId && formData.estimatedWeight && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">
                    Estimated Points:
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    {Math.round(
                      (categoriesList.find(
                        (c) => c.id === formData.wasteCategoryId
                      )?.pointsPerKg || 0) *
                        parseFloat(formData.estimatedWeight || "0")
                    )}{" "}
                    pts
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Final points will be calculated based on actual weight after
                  collection
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={createDonation.isPending}
              >
                {createDonation.isPending ? "Creating..." : "Submit Request"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/donor/dashboard")}
                disabled={createDonation.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Add New Address"
        description="Enter your collection address details or pick from map"
      >
        <div className="mb-4">
          <LocationPicker
            onLocationSelect={(loc) => {
              setNewAddress((prev) => ({
                ...prev,
                latitude: loc.lat,
                longitude: loc.lng,
                // Auto-fill address fields if available from reverse geocoding
                street:
                  loc.address?.road || loc.address?.house_number
                    ? `${loc.address.house_number || ""} ${
                        loc.address.road || ""
                      }`.trim()
                    : prev.street,
                ward: loc.address?.suburb || loc.address?.quarter || prev.ward,
                district:
                  loc.address?.city_district ||
                  loc.address?.county ||
                  prev.district,
                city: loc.address?.city || loc.address?.state || prev.city,
              }));
            }}
          />
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            // If lat/lng are already set by the map picker, use them.
            // Otherwise, try to geocode the text address.
            let latitude = newAddress.latitude;
            let longitude = newAddress.longitude;

            if (!latitude || !longitude) {
              try {
                const fullAddress = `${newAddress.street}, ${newAddress.ward}, ${newAddress.district}, ${newAddress.city}`;
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                    fullAddress
                  )}&format=json&limit=1`
                );
                const data = await response.json();
                if (data && data.length > 0) {
                  latitude = parseFloat(data[0].lat);
                  longitude = parseFloat(data[0].lon);
                }
              } catch (error) {
                console.error("Geocoding failed", error);
              }
            }

            createAddress.mutate({ ...newAddress, latitude, longitude });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address <span className="text-red-500">*</span>
            </label>
            <Input
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
              placeholder="e.g., 123 Nguyen Van Linh"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ward
              </label>
              <Input
                value={newAddress.ward}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, ward: e.target.value })
                }
                placeholder="e.g., Ward 1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                District
              </label>
              <Input
                value={newAddress.district}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, district: e.target.value })
                }
                placeholder="e.g., Hai Chau"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <Input
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
              placeholder="e.g., Da Nang"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddressModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createAddress.isPending}>
              {createAddress.isPending ? "Adding..." : "Add Address"}
            </Button>
          </div>
        </form>
      </Modal>
    </Container>
  );
};
