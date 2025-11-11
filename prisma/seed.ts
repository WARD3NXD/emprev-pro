// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");

  const passwordHash = await bcrypt.hash("demo123", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Platform Admin",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  const employee = await prisma.employee.create({
    data: {
      name: "Aisha Khan",
      email: "aisha@example.com",
      designation: "Frontend Developer",
      employeeCode: "E-001",
      team: "Engineering",
    },
  });

  const template = await prisma.reviewTemplate.create({
    data: {
      title: "Quarterly Review",
      description: "Standard quarterly review template",
      version: 1,
      isLocked: false,
      createdById: admin.id,
      sections: {
        create: [
          {
            label: "Quality of Work",
            type: "RATING",
            description: "Rate the quality and thoroughness of work (1-5).",
            required: true,
            config: { scale: 5 },
            order: 1,
          },
          {
            label: "Project",
            type: "DROPDOWN",
            description: "Select the project they worked on.",
            required: true,
            config: { options: ["Project A", "Project B", "Project C"] },
            order: 2,
          },
          {
            label: "Comments",
            type: "TEXT",
            description: "Any additional comments.",
            required: false,
            order: 3,
          },
          {
            label: "Improvements",
            type: "IMPROVEMENT",
            description: "Suggestions for improvement.",
            required: false,
            order: 4,
          },
          {
            label: "Would work again",
            type: "LIKELIHOOD",
            description: "How likely are you to work with this person again? (1-5)",
            required: true,
            config: { scale: 5 },
            order: 5,
          },
        ],
      },
    },
    include: { sections: true },
  });

  const now = new Date();
  const cycle = await prisma.reviewCycle.create({
    data: {
      title: "Q4 2025 Cycle",
      templateId: template.id,
      startAt: now,
      endAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30),
      createdById: admin.id,
      isActive: true,
    },
  });

  const token = crypto.randomBytes(16).toString("hex");
  const invite = await prisma.invite.create({
    data: {
      token,
      reviewCycleId: cycle.id,
      revieweeId: employee.id,
      expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30),
      isSingleUse: true,
    },
  });

  console.log("Seed completed.");
  console.log("Admin:", admin.email, "password: demo123");
  console.log("Invite token:", token);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
