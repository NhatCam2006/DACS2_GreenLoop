import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

const userSelect = {
  id: true,
  email: true,
  fullName: true,
  phone: true,
  role: true,
  points: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export const userService = {
  findById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: userSelect,
    }),

  findAll: () =>
    prisma.user.findMany({
      select: userSelect,
      orderBy: { createdAt: "desc" },
    }),

  toggleStatus: async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error("User not found");
    }

    return prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: userSelect,
    });
  },

  updateProfile: async (
    id: string,
    data: { fullName?: string; phone?: string }
  ) => {
    return prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    });
  },

  changePassword: async (
    id: string,
    currentPassword: string,
    newPassword: string
  ) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw Object.assign(new Error("Current password is incorrect"), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return prisma.user.update({
      where: { id },
      data: { passwordHash: hashedPassword },
      select: userSelect,
    });
  },
};
