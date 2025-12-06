import { prisma } from "../../lib/prisma";
import { CreateAddressInput, UpdateAddressInput } from "../../schemas/address.schema";

export const addressService = {
  findByUserId: async (userId: string) => {
    return prisma.address.findMany({
      where: { userId },
      include: {
        manualAddress: true,
      },
      orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
    });
  },

  findById: async (id: string, userId: string) => {
    const address = await prisma.address.findFirst({
      where: { id, userId },
      include: {
        manualAddress: true,
      },
    });

    if (!address) {
      throw Object.assign(new Error("Address not found"), { status: 404 });
    }

    return address;
  },

  create: async (userId: string, input: CreateAddressInput) => {
    // If this is set as primary, unset other primary addresses
    if (input.isPrimary) {
      await prisma.address.updateMany({
        where: { userId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const source: "MANUAL" | "GEOCODED" = input.latitude && input.longitude ? "GEOCODED" : "MANUAL";

    const baseData = {
      userId,
      street: input.street,
      ward: input.ward ?? null,
      district: input.district ?? null,
      city: input.city ?? null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      source,
      isPrimary: input.isPrimary,
    };

    const createData = source === "MANUAL"
      ? {
          ...baseData,
          manualAddress: {
            create: {
              note: input.note ?? null,
              placeHints: input.placeHints ?? null,
              contactName: input.contactName ?? null,
            },
          },
        }
      : baseData;

    return prisma.address.create({
      data: createData,
      include: {
        manualAddress: true,
      },
    });
  },

  update: async (id: string, userId: string, input: UpdateAddressInput) => {
    await addressService.findById(id, userId);

    // If this is set as primary, unset other primary addresses
    if (input.isPrimary) {
      await prisma.address.updateMany({
        where: { userId, isPrimary: true, id: { not: id } },
        data: { isPrimary: false },
      });
    }

    const addressData: any = {
      street: input.street,
      ward: input.ward,
      district: input.district,
      city: input.city,
      latitude: input.latitude,
      longitude: input.longitude,
      isPrimary: input.isPrimary,
    };

    // Update source if coordinates are provided
    if (input.latitude && input.longitude) {
      addressData.source = "GEOCODED";
    }

    return prisma.address.update({
      where: { id },
      data: {
        ...addressData,
        manualAddress:
          input.note || input.placeHints || input.contactName
            ? {
                upsert: {
                  create: {
                    note: input.note,
                    placeHints: input.placeHints,
                    contactName: input.contactName,
                  },
                  update: {
                    note: input.note,
                    placeHints: input.placeHints,
                    contactName: input.contactName,
                  },
                },
              }
            : undefined,
      },
      include: {
        manualAddress: true,
      },
    });
  },

  delete: async (id: string, userId: string) => {
    await addressService.findById(id, userId);
    return prisma.address.delete({
      where: { id },
    });
  },
};

