import { prisma } from "../config/Prisma.js";
import { randomUUID } from "crypto";

const getAllTables = async (filters = {}) => {
  return prisma.table.findMany({
    where: filters,
    orderBy: { tableNumber: "asc" },
    include: {
      orders: {
        where: { status: "active" },
      },
    },
  });
};

const createTable = async () => {
  const last = await prisma.table.findFirst({
    orderBy: { tableNumber: "desc" },
    select: { tableNumber: true },
  });
  const nextNumber = last && typeof last.tableNumber === "number" ? last.tableNumber + 1 : 1;
  const qrToken = randomUUID();

  return prisma.table.create({
    data: {
      tableNumber: nextNumber,
      qrToken,
      isActive: true,
    },
  });
};

const deleteTable = async (id) => {
  return prisma.table.delete({ where: { id } });
};

const setTableActive = async (id, isActive) => {
  return prisma.table.update({ where: { id }, data: { isActive } });
};

export { getAllTables, createTable, deleteTable, setTableActive };
