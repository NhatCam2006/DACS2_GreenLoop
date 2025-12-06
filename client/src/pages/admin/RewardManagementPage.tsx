import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Container } from "../../components/layout/Container";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { apiClient } from "../../lib/api-client";
import { Gift, Plus, Edit2, Trash2, Save, X, Package } from "lucide-react";
import toast from "react-hot-toast";

interface Reward {
  id: string;
  name: string;
  description: string | null;
  pointsCost: number;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
}

export const RewardManagementPage = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pointsCost: 0,
    stock: 0,
    imageUrl: "",
  });

  const {
    data: rewards,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin", "rewards"],
    queryFn: async () => {
      const response = await apiClient.get("/rewards");
      return response.data.rewards;
    },
  });

  // Ensure rewards is an array
  const rewardsList = Array.isArray(rewards) ? rewards : [];

  const createReward = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiClient.post("/rewards", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "rewards"] });
      toast.success("Reward created successfully");
      setIsCreating(false);
      resetForm();
    },
    onError: () => {
      toast.error("Failed to create reward");
    },
  });

  const updateReward = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<typeof formData>;
    }) => {
      const response = await apiClient.put(`/rewards/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "rewards"] });
      toast.success("Reward updated successfully");
      setEditingId(null);
      resetForm();
    },
    onError: () => {
      toast.error("Failed to update reward");
    },
  });

  const deleteReward = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/rewards/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "rewards"] });
      toast.success("Reward deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete reward");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      pointsCost: 0,
      stock: 0,
      imageUrl: "",
    });
  };

  const handleEdit = (reward: Reward) => {
    setEditingId(reward.id);
    setFormData({
      name: reward.name,
      description: reward.description || "",
      pointsCost: reward.pointsCost,
      stock: reward.stock,
      imageUrl: reward.imageUrl || "",
    });
  };

  const handleSave = () => {
    if (isCreating) {
      createReward.mutate(formData);
    } else if (editingId) {
      updateReward.mutate({ id: editingId, data: formData });
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this reward?")) {
      deleteReward.mutate(id);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <Container>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading rewards...</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <Container>
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <Gift className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to load rewards
            </h2>
            <p className="text-gray-600 mb-4">
              Please check your connection and try again
            </p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Container>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Rewards Management
            </h1>
            <p className="text-lg text-gray-600">
              Manage rewards catalog and stock
            </p>
          </div>
          <Button
            onClick={() => {
              setIsCreating(true);
              resetForm();
            }}
            disabled={isCreating || editingId !== null}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Reward
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0">
            <div className="p-6 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold mb-1">
                    {rewardsList.length}
                  </div>
                  <div className="text-sm font-medium opacity-90">
                    Total Rewards
                  </div>
                </div>
                <Gift className="h-8 w-8 opacity-75" />
              </div>
            </div>
          </Card>
          <Card className="border-0">
            <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold mb-1">
                    {rewardsList.filter((r: Reward) => r.isActive).length}
                  </div>
                  <div className="text-sm font-medium opacity-90">
                    Active Rewards
                  </div>
                </div>
                <Gift className="h-8 w-8 opacity-75" />
              </div>
            </div>
          </Card>
          <Card className="border-0">
            <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold mb-1">
                    {rewardsList.reduce(
                      (sum: number, r: Reward) => sum + r.stock,
                      0
                    )}
                  </div>
                  <div className="text-sm font-medium opacity-90">
                    Total Stock
                  </div>
                </div>
                <Package className="h-8 w-8 opacity-75" />
              </div>
            </div>
          </Card>
          <Card className="border-0">
            <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold mb-1">
                    {rewardsList.filter((r: Reward) => r.stock === 0).length}
                  </div>
                  <div className="text-sm font-medium opacity-90">
                    Out of Stock
                  </div>
                </div>
                <Package className="h-8 w-8 opacity-75" />
              </div>
            </div>
          </Card>
        </div>

        {/* Create Form */}
        {isCreating && (
          <Card className="mb-6">
            <div className="p-6 bg-pink-50 border-l-4 border-pink-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Create New Reward
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Reward Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Eco Water Bottle"
                />
                <Input
                  label="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Description..."
                />
                <Input
                  label="Points Cost"
                  type="number"
                  value={formData.pointsCost}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pointsCost: parseInt(e.target.value),
                    })
                  }
                  placeholder="100"
                />
                <Input
                  label="Stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: parseInt(e.target.value),
                    })
                  }
                  placeholder="50"
                />
                <div className="md:col-span-2">
                  <Input
                    label="Image URL"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Create
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Rewards Grid */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              All Rewards
            </h2>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading rewards...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewardsList.map((reward: Reward) => (
                  <div
                    key={reward.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {editingId === reward.id ? (
                      <div className="p-4 bg-gray-50">
                        <div className="space-y-3 mb-4">
                          <Input
                            label="Reward Name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                          />
                          <Input
                            label="Description"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                          />
                          <Input
                            label="Points Cost"
                            type="number"
                            value={formData.pointsCost}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pointsCost: parseInt(e.target.value),
                              })
                            }
                          />
                          <Input
                            label="Stock"
                            type="number"
                            value={formData.stock}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                stock: parseInt(e.target.value),
                              })
                            }
                          />
                          <Input
                            label="Image URL"
                            value={formData.imageUrl}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                imageUrl: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSave} size="sm">
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleCancel}
                            size="sm"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Image */}
                        <div className="aspect-video bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                          {reward.imageUrl ? (
                            <img
                              src={reward.imageUrl}
                              alt={reward.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Gift className="h-16 w-16 text-pink-300" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {reward.name}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                reward.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {reward.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {reward.description || "No description"}
                          </p>
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-2xl font-bold text-pink-600">
                              {reward.pointsCost} pts
                            </div>
                            <div
                              className={`text-sm font-medium ${
                                reward.stock > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              Stock: {reward.stock}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(reward)}
                              className="flex-1"
                            >
                              <Edit2 className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(reward.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {rewardsList.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No rewards found</p>
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
