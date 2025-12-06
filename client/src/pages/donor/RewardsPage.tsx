import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Container } from "../../components/layout/Container";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { apiClient } from "../../lib/api-client";
import type { Reward } from "../../types";
import { useUser } from "../../hooks/useUser";
import toast from "react-hot-toast";

export const RewardsPage = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const { data: rewards = [], isLoading } = useQuery({
    queryKey: ["rewards"],
    queryFn: async () => {
      const response = await apiClient.get<{ rewards: Reward[] }>("/rewards");
      return response.data.rewards;
    },
  });

  const redeemMutation = useMutation({
    mutationFn: async (rewardId: string) => {
      const response = await apiClient.post(`/rewards/${rewardId}/redeem`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Reward redeemed successfully!");
      setSelectedReward(null);
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      // Refresh user data to update points
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to redeem reward");
    },
  });

  const handleRedeem = (reward: Reward) => {
    if ((user?.points || 0) < reward.pointsCost) {
      toast.error("Insufficient points");
      return;
    }
    if (reward.stock <= 0) {
      toast.error("Reward out of stock");
      return;
    }
    setSelectedReward(reward);
  };

  const confirmRedeem = () => {
    if (selectedReward) {
      redeemMutation.mutate(selectedReward.id);
    }
  };

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rewards Store</h1>
        <p className="text-gray-600 mb-4">
          Redeem your points for exciting rewards
        </p>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white inline-block">
          <div className="px-6 py-4">
            <p className="text-green-100 text-sm mb-1">Your Points Balance</p>
            <p className="text-3xl font-bold">{user?.points || 0} pts</p>
          </div>
        </Card>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading rewards...</p>
        </div>
      ) : rewards.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-600">No rewards available at the moment</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards
            .filter((reward) => reward.isActive)
            .map((reward) => {
              const canAfford = (user?.points || 0) >= reward.pointsCost;
              const inStock = reward.stock > 0;

              return (
                <Card
                  key={reward.id}
                  className={`overflow-hidden ${
                    !canAfford || !inStock ? "opacity-75" : ""
                  }`}
                >
                  {reward.imageUrl && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={reward.imageUrl}
                        alt={reward.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {reward.name}
                      </h3>
                      {!inStock && (
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          Out of Stock
                        </Badge>
                      )}
                    </div>

                    {reward.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {reward.description}
                      </p>
                    )}

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          Points Cost
                        </span>
                        <span className="text-xl font-bold text-green-600">
                          {reward.pointsCost} pts
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Stock</span>
                        <span className="text-sm font-medium text-gray-900">
                          {reward.stock} available
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => handleRedeem(reward)}
                      disabled={
                        !canAfford || !inStock || redeemMutation.isPending
                      }
                    >
                      {!inStock
                        ? "Out of Stock"
                        : !canAfford
                        ? `Need ${
                            reward.pointsCost - (user?.points || 0)
                          } more pts`
                        : "Redeem Now"}
                    </Button>
                  </div>
                </Card>
              );
            })}
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Confirm Redemption
              </h3>

              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  Are you sure you want to redeem:
                </p>
                <p className="text-lg font-bold text-gray-900 mb-1">
                  {selectedReward.name}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  for {selectedReward.pointsCost} points?
                </p>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Current Balance:
                    </span>
                    <span className="text-sm font-medium">
                      {user?.points} pts
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Redemption Cost:
                    </span>
                    <span className="text-sm font-medium text-red-600">
                      -{selectedReward.pointsCost} pts
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      New Balance:
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {(user?.points || 0) - selectedReward.pointsCost} pts
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  className="flex-1"
                  onClick={confirmRedeem}
                  disabled={redeemMutation.isPending}
                >
                  {redeemMutation.isPending ? "Redeeming..." : "Confirm"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedReward(null)}
                  disabled={redeemMutation.isPending}
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
