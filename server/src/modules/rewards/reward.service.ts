import { prisma } from "../../lib/prisma";
import {
  CreateRewardInput,
  UpdateRewardInput,
} from "../../schemas/reward.schema";
import { notificationService } from "../notifications/notification.service";

export const rewardService = {
  findAll: async (activeOnly = true) => {
    return prisma.reward.findMany({
      where: activeOnly ? { isActive: true, stock: { gt: 0 } } : {},
      orderBy: { pointsCost: "asc" },
    });
  },

  findById: async (id: string) => {
    const reward = await prisma.reward.findUnique({
      where: { id },
    });
    if (!reward) {
      throw Object.assign(new Error("Reward not found"), { status: 404 });
    }
    return reward;
  },

  create: async (input: CreateRewardInput) => {
    return prisma.reward.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        pointsCost: input.pointsCost,
        imageUrl: input.imageUrl ?? null,
        stock: input.stock,
      },
    });
  },

  update: async (id: string, input: UpdateRewardInput) => {
    await rewardService.findById(id);

    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined)
      updateData.description = input.description ?? null;
    if (input.pointsCost !== undefined)
      updateData.pointsCost = input.pointsCost;
    if (input.imageUrl !== undefined)
      updateData.imageUrl = input.imageUrl ?? null;
    if (input.stock !== undefined) updateData.stock = input.stock;
    if (input.isActive !== undefined) updateData.isActive = input.isActive;

    return prisma.reward.update({
      where: { id },
      data: updateData,
    });
  },

  delete: async (id: string) => {
    await rewardService.findById(id);
    return prisma.reward.delete({
      where: { id },
    });
  },

  redeem: async (userId: string, rewardId: string) => {
    const reward = await rewardService.findById(rewardId);

    if (!reward.isActive || reward.stock <= 0) {
      throw Object.assign(new Error("Reward is not available"), {
        status: 400,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { points: true },
    });

    if (!user || user.points < reward.pointsCost) {
      throw Object.assign(new Error("Insufficient points"), { status: 400 });
    }

    // Redeem reward in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct points from user
      await tx.user.update({
        where: { id: userId },
        data: {
          points: {
            decrement: reward.pointsCost,
          },
        },
      });

      // Decrease reward stock
      await tx.reward.update({
        where: { id: rewardId },
        data: {
          stock: {
            decrement: 1,
          },
        },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          userId,
          type: "REDEEM",
          amount: -reward.pointsCost,
          description: `Redeemed: ${reward.name}`,
          relatedId: rewardId,
        },
      });

      return { transaction, reward };
    });

    // Send notification (outside transaction)
    try {
      await notificationService.notifyRewardRedeemed(
        userId,
        reward.name,
        reward.pointsCost,
        rewardId
      );
    } catch (e) {
      console.error("Failed to send notification:", e);
    }

    return result;
  },
};
