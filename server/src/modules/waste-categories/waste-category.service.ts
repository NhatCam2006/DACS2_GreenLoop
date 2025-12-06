import { prisma } from "../../lib/prisma";
import { CreateWasteCategoryInput, UpdateWasteCategoryInput } from "../../schemas/waste-category.schema";

export const wasteCategoryService = {
  findAll: async (activeOnly = true) => {
    return prisma.wasteCategory.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: { name: "asc" },
    });
  },

  findById: async (id: string) => {
    const category = await prisma.wasteCategory.findUnique({
      where: { id },
    });
    if (!category) {
      throw Object.assign(new Error("Waste category not found"), { status: 404 });
    }
    return category;
  },

  create: async (input: CreateWasteCategoryInput) => {
    const existing = await prisma.wasteCategory.findUnique({
      where: { name: input.name },
    });
    if (existing) {
      throw Object.assign(new Error("Waste category with this name already exists"), { status: 409 });
    }

    return prisma.wasteCategory.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        pointsPerKg: input.pointsPerKg,
        iconUrl: input.iconUrl ?? null,
      },
    });
  },

  update: async (id: string, input: UpdateWasteCategoryInput) => {
    await wasteCategoryService.findById(id);

    if (input.name) {
      const existing = await prisma.wasteCategory.findFirst({
        where: {
          name: input.name,
          id: { not: id },
        },
      });
      if (existing) {
        throw Object.assign(new Error("Waste category with this name already exists"), { status: 409 });
      }
    }

    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description ?? null;
    if (input.pointsPerKg !== undefined) updateData.pointsPerKg = input.pointsPerKg;
    if (input.iconUrl !== undefined) updateData.iconUrl = input.iconUrl ?? null;
    if (input.isActive !== undefined) updateData.isActive = input.isActive;

    return prisma.wasteCategory.update({
      where: { id },
      data: updateData,
    });
  },

  delete: async (id: string) => {
    await wasteCategoryService.findById(id);
    return prisma.wasteCategory.delete({
      where: { id },
    });
  },
};

