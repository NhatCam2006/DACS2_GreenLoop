import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { apiClient } from "../lib/api-client";
import { useAuthStore } from "../stores/auth.store";
import type { User } from "../types";

/**
 * Hook to fetch and sync user data with auth store.
 * This ensures user data (especially points) stays in sync with the server.
 *
 * Uses React Query to cache and auto-refetch user data.
 */
export const useUser = () => {
  const { user, isAuthenticated, updateUser } = useAuthStore();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const response = await apiClient.get<{ user: User }>("/users/me");
      return response.data.user;
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
    refetchOnWindowFocus: true, // Refetch when user comes back to tab
    refetchInterval: 60 * 1000, // Refetch every 60 seconds
  });

  // Sync fetched data with auth store
  useEffect(() => {
    if (data && user) {
      // Only update if points have changed to avoid unnecessary re-renders
      if (data.points !== user.points) {
        updateUser({ points: data.points });
      }
      // Also sync other fields that might change
      if (data.fullName !== user.fullName || data.phone !== user.phone) {
        updateUser({
          fullName: data.fullName,
          phone: data.phone,
        });
      }
    }
  }, [data, user, updateUser]);

  return {
    user: data || user,
    isLoading,
    refetch,
  };
};

/**
 * Hook to manually refresh user data after actions that change points
 * (e.g., after completing a donation or redeeming a reward)
 */
export const useRefreshUser = () => {
  const { updateUser } = useAuthStore();

  const refreshUser = async () => {
    try {
      const response = await apiClient.get<{ user: User }>("/users/me");
      const user = response.data.user;
      updateUser({
        points: user.points,
        fullName: user.fullName,
        phone: user.phone,
      });
      return user;
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      return null;
    }
  };

  return { refreshUser };
};
