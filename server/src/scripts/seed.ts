import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting seed...");

  // Seed admin user
  const adminEmail = "admin@greenloop.local";
  const passwordHash = await bcrypt.hash("Admin@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      fullName: "GreenLoop Admin",
      role: "ADMIN",
    },
  });
  console.log("✅ Seeded admin user:", adminEmail);

  // Seed donor user
  const donorEmail = "donor@greenloop.local";
  const donorPasswordHash = await bcrypt.hash("Donor@123", 10);
  const donor = await prisma.user.upsert({
    where: { email: donorEmail },
    update: { passwordHash: donorPasswordHash },
    create: {
      email: donorEmail,
      passwordHash: donorPasswordHash,
      fullName: "Demo Donor",
      role: "DONOR",
    },
  });
  console.log("✅ Seeded donor user:", donorEmail);

  // Seed collector user
  const collectorEmail = "collector@greenloop.local";
  const collectorPasswordHash = await bcrypt.hash("Collector@123", 10);
  const collector = await prisma.user.upsert({
    where: { email: collectorEmail },
    update: { passwordHash: collectorPasswordHash },
    create: {
      email: collectorEmail,
      passwordHash: collectorPasswordHash,
      fullName: "Demo Collector",
      role: "COLLECTOR",
    },
  });
  console.log("✅ Seeded collector user:", collectorEmail);

  // Seed waste categories
  const wasteCategories = [
    {
      name: "Plastic",
      description: "Plastic bottles, containers, packaging",
      pointsPerKg: 10,
    },
    {
      name: "Paper",
      description: "Newspapers, cardboard, office paper",
      pointsPerKg: 5,
    },
    {
      name: "Metal",
      description: "Aluminum cans, steel containers",
      pointsPerKg: 15,
    },
    { name: "Glass", description: "Glass bottles and jars", pointsPerKg: 8 },
    {
      name: "Electronics",
      description: "Old phones, computers, appliances",
      pointsPerKg: 20,
    },
    {
      name: "Textile",
      description: "Old clothes, fabric scraps",
      pointsPerKg: 7,
    },
  ];

  for (const category of wasteCategories) {
    await prisma.wasteCategory.upsert({
      where: { name: category.name },
      update: category,
      create: category,
    });
  }
  console.log("✅ Seeded waste categories:", wasteCategories.length);

  // Seed rewards
  const rewards = [
    {
      name: "Coffee Voucher",
      description: "Free coffee at partner cafes",
      pointsCost: 50,
      stock: 100,
    },
    {
      name: "Eco Bag",
      description: "Reusable shopping bag",
      pointsCost: 100,
      stock: 50,
    },
    {
      name: "Plant Seedling",
      description: "Tree or herb seedling kit",
      pointsCost: 80,
      stock: 75,
    },
    {
      name: "Discount 10%",
      description: "10% off at green stores",
      pointsCost: 150,
      stock: 200,
    },
    {
      name: "Bamboo Straw Set",
      description: "Set of 4 reusable straws",
      pointsCost: 120,
      stock: 60,
    },
  ];

  for (const reward of rewards) {
    await prisma.reward.upsert({
      where: { name: reward.name },
      update: reward,
      create: reward,
    });
  }
  console.log("✅ Seeded rewards:", rewards.length);

  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
