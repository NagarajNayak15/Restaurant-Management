import { prisma } from "./src/config/Prisma.js";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();

    console.log('✅ Prisma connected successfully');

    const tables = await prisma.table.findMany();

    console.log('Tables:', tables);

  } catch (error) {
    console.error('❌ Connection failed');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
