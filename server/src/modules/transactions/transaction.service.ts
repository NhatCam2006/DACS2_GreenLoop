import { prisma } from "../../lib/prisma";

export const transactionService = {
  findByUserId: async (userId: string, limit = 50) => {
    return prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  getBalance: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { points: true },
    });
    return user?.points || 0;
  },
};

