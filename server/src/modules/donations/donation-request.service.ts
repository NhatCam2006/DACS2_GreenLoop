import { prisma } from "../../lib/prisma";
import {
  CreateDonationRequestInput,
  UpdateDonationRequestInput,
  CompleteDonationRequestInput,
} from "../../schemas/donation-request.schema";
import { notificationService } from "../notifications/notification.service";

export const donationRequestService = {
  findAll: async (filters?: {
    status?: string;
    donorId?: string;
    wasteCategoryId?: string;
    district?: string;
    collectorId?: string;
  }) => {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.donorId) {
      where.donorId = filters.donorId;
    }
    if (filters?.collectorId) {
      where.collection = {
        collectorId: filters.collectorId,
      };
    }
    if (filters?.wasteCategoryId) {
      where.wasteCategoryId = filters.wasteCategoryId;
    }
    if (filters?.district) {
      where.address = {
        district: filters.district,
      };
    }

    return prisma.donationRequest.findMany({
      where,
      include: {
        donor: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
        wasteCategory: true,
        address: {
          include: {
            manualAddress: true,
          },
        },
        collection: {
          include: {
            collector: {
              select: {
                id: true,
                fullName: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  findById: async (id: string) => {
    const request = await prisma.donationRequest.findUnique({
      where: { id },
      include: {
        donor: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
          },
        },
        wasteCategory: true,
        address: {
          include: {
            manualAddress: true,
          },
        },
        collection: {
          include: {
            collector: {
              select: {
                id: true,
                fullName: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!request) {
      throw Object.assign(new Error("Donation request not found"), {
        status: 404,
      });
    }

    return request;
  },

  create: async (donorId: string, input: CreateDonationRequestInput) => {
    // Verify waste category exists
    const wasteCategory = await prisma.wasteCategory.findUnique({
      where: { id: input.wasteCategoryId },
    });
    if (!wasteCategory || !wasteCategory.isActive) {
      throw Object.assign(new Error("Invalid or inactive waste category"), {
        status: 400,
      });
    }

    // Verify address belongs to donor
    const address = await prisma.address.findFirst({
      where: {
        id: input.addressId,
        userId: donorId,
      },
    });
    if (!address) {
      throw Object.assign(
        new Error("Address not found or does not belong to you"),
        { status: 404 }
      );
    }

    return prisma.donationRequest.create({
      data: {
        donorId,
        wasteCategoryId: input.wasteCategoryId,
        estimatedWeight: input.estimatedWeight,
        imageUrls: input.imageUrls,
        addressId: input.addressId,
        notes: input.notes ?? null,
        preferredDate: input.preferredDate
          ? new Date(input.preferredDate)
          : null,
      },
      include: {
        wasteCategory: true,
        address: true,
      },
    });
  },

  update: async (
    id: string,
    donorId: string,
    input: UpdateDonationRequestInput
  ) => {
    const request = await donationRequestService.findById(id);

    if (request.donorId !== donorId) {
      throw Object.assign(
        new Error("You can only update your own donation requests"),
        { status: 403 }
      );
    }

    if (request.status !== "PENDING") {
      throw Object.assign(new Error("Can only update pending requests"), {
        status: 400,
      });
    }

    const updateData: any = {};
    if (input.estimatedWeight !== undefined)
      updateData.estimatedWeight = input.estimatedWeight;
    if (input.imageUrls !== undefined) updateData.imageUrls = input.imageUrls;
    if (input.notes !== undefined) updateData.notes = input.notes ?? null;
    if (input.preferredDate !== undefined) {
      updateData.preferredDate = input.preferredDate
        ? new Date(input.preferredDate)
        : null;
    }

    return prisma.donationRequest.update({
      where: { id },
      data: updateData,
      include: {
        wasteCategory: true,
        address: true,
      },
    });
  },

  cancel: async (id: string, userId: string) => {
    const request = await donationRequestService.findById(id);

    if (request.donorId !== userId) {
      throw Object.assign(
        new Error("You can only cancel your own donation requests"),
        { status: 403 }
      );
    }

    if (request.status === "COMPLETED" || request.status === "CANCELLED") {
      throw Object.assign(new Error("Cannot cancel this request"), {
        status: 400,
      });
    }

    return prisma.donationRequest.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
  },

  accept: async (donationRequestId: string, collectorId: string) => {
    const request = await donationRequestService.findById(donationRequestId);

    if (request.status !== "PENDING") {
      throw Object.assign(new Error("This request is not available"), {
        status: 400,
      });
    }

    // Get collector info for notification
    const collector = await prisma.user.findUnique({
      where: { id: collectorId },
      select: { fullName: true },
    });

    // Create collection record and update request status in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Generate 6-digit OTP
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const collection = await tx.collection.create({
        data: {
          donationRequestId,
          collectorId,
          verificationCode,
        },
      });

      const updatedRequest = await tx.donationRequest.update({
        where: { id: donationRequestId },
        data: { status: "ACCEPTED" },
        include: {
          wasteCategory: true,
          address: true,
          donor: {
            select: {
              id: true,
              fullName: true,
              phone: true,
            },
          },
        },
      });

      return { collection, request: updatedRequest };
    });

    // Send notification to donor (outside transaction)
    try {
      await notificationService.notifyDonationAccepted(
        request.donorId,
        collector?.fullName || "A collector",
        request.wasteCategory?.name || "your",
        donationRequestId
      );
    } catch (e) {
      console.error("Failed to send notification:", e);
    }

    return result;
  },

  complete: async (
    donationRequestId: string,
    collectorId: string,
    input: CompleteDonationRequestInput
  ) => {
    const request = await donationRequestService.findById(donationRequestId);

    if (request.status !== "ACCEPTED") {
      throw Object.assign(new Error("This request cannot be completed"), {
        status: 400,
      });
    }

    if (!request.collection || request.collection.collectorId !== collectorId) {
      throw Object.assign(new Error("You are not the assigned collector"), {
        status: 403,
      });
    }

    // Verify OTP
    if (request.collection.verificationCode !== input.verificationCode) {
      throw Object.assign(new Error("Invalid verification code"), {
        status: 400,
      });
    }

    // Complete the donation and award points in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const wasteCategory = await tx.wasteCategory.findUnique({
        where: { id: request.wasteCategoryId },
      });

      const pointsAwarded =
        input.actualWeight * (wasteCategory?.pointsPerKg || 0);

      // Update collection
      await tx.collection.update({
        where: { id: request.collection!.id },
        data: {
          collectedAt: new Date(),
          verificationNotes: input.verificationNotes ?? null,
          verificationImages: input.verificationImages ?? [],
          pointsAwarded,
        },
      });

      // Update donation request
      const updatedRequest = await tx.donationRequest.update({
        where: { id: donationRequestId },
        data: {
          status: "COMPLETED",
          actualWeight: input.actualWeight,
        },
        include: {
          wasteCategory: true,
          donor: true,
          collection: {
            include: {
              collector: {
                select: {
                  id: true,
                  fullName: true,
                },
              },
            },
          },
        },
      });

      // Award points to donor
      await tx.user.update({
        where: { id: request.donorId },
        data: {
          points: {
            increment: pointsAwarded,
          },
        },
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: request.donorId,
          type: "EARN",
          amount: pointsAwarded,
          description: `Donated ${input.actualWeight}kg of ${wasteCategory?.name}`,
          relatedId: donationRequestId,
        },
      });

      return {
        request: updatedRequest,
        pointsAwarded,
        categoryName: wasteCategory?.name,
      };
    });

    // Send notification to donor (outside transaction)
    try {
      await notificationService.notifyDonationCompleted(
        request.donorId,
        result.categoryName || "waste",
        result.pointsAwarded,
        donationRequestId
      );
    } catch (e) {
      console.error("Failed to send notification:", e);
    }

    return result;
  },
};
