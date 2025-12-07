import { prisma } from "../../lib/prisma";

type NotificationType =
  | "DONATION_ACCEPTED"
  | "DONATION_COMPLETED"
  | "REWARD_REDEEMED"
  | "POINTS_EARNED"
  | "SYSTEM";

export const notificationService = {
  /**
   * Create a notification for a user
   */
  create: async (data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    relatedId?: string;
  }) => {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        relatedId: data.relatedId ?? null,
      },
    });
  },

  /**
   * Get all notifications for a user
   */
  findByUserId: async (userId: string, limit = 50) => {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  /**
   * Get unread count for a user
   */
  getUnreadCount: async (userId: string) => {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (id: string, userId: string) => {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  },

  /**
   * Mark all notifications as read for a user
   */
  markAllAsRead: async (userId: string) => {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },

  /**
   * Delete a notification
   */
  delete: async (id: string, userId: string) => {
    return prisma.notification.deleteMany({
      where: { id, userId },
    });
  },

  // Helper functions to create specific notification types

  /**
   * Notify donor when their donation request is accepted
   */
  notifyDonationAccepted: async (
    donorId: string,
    collectorName: string,
    categoryName: string,
    donationRequestId: string,
    verificationCode?: string
  ) => {
    const codeMessage = verificationCode
      ? `\n\n🔐 Mã xác nhận: ${verificationCode}\n(Cung cấp mã này cho collector khi họ đến thu gom)`
      : "";

    return notificationService.create({
      userId: donorId,
      type: "DONATION_ACCEPTED",
      title: "Donation Request Accepted! 🎉",
      message: `${collectorName} has accepted your ${categoryName} donation request. Please prepare your items for collection.${codeMessage}`,
      relatedId: donationRequestId,
    });
  },

  /**
   * Notify donor when donation is completed and points earned
   */
  notifyDonationCompleted: async (
    donorId: string,
    categoryName: string,
    pointsEarned: number,
    donationRequestId: string
  ) => {
    return notificationService.create({
      userId: donorId,
      type: "DONATION_COMPLETED",
      title: "Donation Completed! 🌟",
      message: `Your ${categoryName} donation has been collected. You earned ${pointsEarned} points!`,
      relatedId: donationRequestId,
    });
  },

  /**
   * Notify user when reward is redeemed
   */
  notifyRewardRedeemed: async (
    userId: string,
    rewardName: string,
    pointsCost: number,
    rewardId: string
  ) => {
    return notificationService.create({
      userId,
      type: "REWARD_REDEEMED",
      title: "Reward Redeemed! 🎁",
      message: `You have successfully redeemed "${rewardName}" for ${pointsCost} points.`,
      relatedId: rewardId,
    });
  },
};
