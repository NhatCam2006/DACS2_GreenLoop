import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Container } from "../../components/layout/Container";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { apiClient } from "../../lib/api-client";
import { ShoppingBag, Plus, Edit2, Trash2, Save, X } from "lucide-react";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  description: string | null;
  pointsPerKg: number;
  isActive: boolean;
}

export const CategoryManagementPage = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    description: string | null;
    pointsPerKg: number | string;
  }>({
    name: "",
    description: "",
    pointsPerKg: "",
  });

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["waste-categories"],
    queryFn: async () => {
      const response = await apiClient.get("/waste-categories");
      return response.data.categories;
    },
  });

  // Ensure categories is an array
  const categoriesList = Array.isArray(categories) ? categories : [];

  const createCategory = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiClient.post("/waste-categories", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waste-categories"] });
      toast.success("Category created successfully");
      setIsCreating(false);
      resetForm();
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to create category";
      toast.error(message);
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.put(`/waste-categories/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waste-categories"] });
      toast.success("Category updated successfully");
      setEditingId(null);
      resetForm();
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update category";
      toast.error(message);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/waste-categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waste-categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to delete category";
      toast.error(message);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      pointsPerKg: "",
    });
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || "",
      pointsPerKg: category.pointsPerKg,
    });
  };

  const handleSave = () => {
    // Validate
    if (!formData.name || !formData.pointsPerKg) {
      toast.error("Please fill in all required fields");
      return;
    }

    const pointsPerKg =
      typeof formData.pointsPerKg === "string"
        ? parseFloat(formData.pointsPerKg)
        : formData.pointsPerKg;

    if (isNaN(pointsPerKg) || pointsPerKg <= 0) {
      toast.error("Please enter a valid points per kg value");
      return;
    }

    const dataToSend = {
      name: formData.name,
      description: formData.description || null,
      pointsPerKg: pointsPerKg,
    };

    if (isCreating) {
      createCategory.mutate(dataToSend);
    } else if (editingId) {
      updateCategory.mutate({ id: editingId, data: dataToSend });
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategory.mutate(id);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <Container>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading categories...</p>
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
              <ShoppingBag className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to load categories
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
              Waste Categories
            </h1>
            <p className="text-lg text-gray-600">
              Manage waste categories and pricing
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
            Add Category
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0">
            <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold mb-1">
                    {Array.isArray(categories) ? categories.length : 0}
                  </div>
                  <div className="text-sm font-medium opacity-90">
                    Total Categories
                  </div>
                </div>
                <ShoppingBag className="h-8 w-8 opacity-75" />
              </div>
            </div>
          </Card>
          <Card className="border-0">
            <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold mb-1">
                    {Array.isArray(categories)
                      ? categories.filter((c: Category) => c.isActive).length
                      : 0}
                  </div>
                  <div className="text-sm font-medium opacity-90">
                    Active Categories
                  </div>
                </div>
                <ShoppingBag className="h-8 w-8 opacity-75" />
              </div>
            </div>
          </Card>
          <Card className="border-0">
            <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold mb-1">
                    {Array.isArray(categories)
                      ? categories.reduce(
                          (sum: number, c: Category) => sum + c.pointsPerKg,
                          0
                        )
                      : 0}
                  </div>
                  <div className="text-sm font-medium opacity-90">
                    Total Points/Kg
                  </div>
                </div>
                <ShoppingBag className="h-8 w-8 opacity-75" />
              </div>
            </div>
          </Card>
        </div>

        {/* Create Form */}
        {isCreating && (
          <Card className="mb-6">
            <div className="p-6 bg-blue-50 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Create New Category
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input
                  label="Category Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Plastic"
                />
                <Input
                  label="Description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Description..."
                />
                <Input
                  label="Points per Kg"
                  type="number"
                  value={formData.pointsPerKg}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pointsPerKg: parseFloat(e.target.value),
                    })
                  }
                  placeholder="10"
                />
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

        {/* Categories List */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              All Categories
            </h2>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading categories...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {categoriesList.map((category: Category) => (
                  <div
                    key={category.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {editingId === category.id ? (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <Input
                            label="Category Name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                          />
                          <Input
                            label="Description"
                            value={formData.description || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                          />
                          <Input
                            label="Points per Kg"
                            type="number"
                            value={formData.pointsPerKg}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pointsPerKg: parseFloat(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSave} size="sm">
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleCancel}
                            size="sm"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {category.name}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                category.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {category.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {category.description || "No description"}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-green-600">
                              {category.pointsPerKg} points/kg
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(category)}
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {categoriesList.length === 0 && (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No categories found</p>
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
