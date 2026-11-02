import { prisma } from "../config/Prisma.js";

const tableAvailable = async (qrToken) => {
  const table = await prisma.table.findFirst({
    where: { qrToken },
    select: { isActive: true, tableNumber: true },
  });

  return {
    available: Boolean(table?.isActive),
    tableNumber: table?.tableNumber ?? null,
  };
};

const createCustomerForTable = async (qrToken, phone, name) => {
  return prisma.$transaction(async (transaction) => {
    const table = await transaction.table.findFirst({
      where: { qrToken },
      select: { id: true, isActive: true, tableNumber: true },
    });

    if (!table) {
      const error = new Error("Table not found");
      error.statusCode = 404;
      throw error;
    }

    if (!table.isActive) {
      const error = new Error("Table is not active");
      error.statusCode = 409;
      throw error;
    }

    const existingCustomer = await transaction.customer.findFirst({
      where: { phone },
      select: { id: true, name: true, phone: true },
    });

    if (!existingCustomer && !name) {
      return { needsName: true };
    }

    const reservation = await transaction.table.updateMany({
      where: { id: table.id, isActive: true },
      data: { isActive: false },
    });

    if (reservation.count !== 1) {
      const error = new Error("Table is not active");
      error.statusCode = 409;
      throw error;
    }

    if (existingCustomer) {
      return {
        customer: existingCustomer,
        tableId: table.id,
        tableNumber: table.tableNumber,
        created: false,
      };
    }

    const customer = await transaction.customer.create({
      data: { name, phone },
      select: { id: true, name: true, phone: true },
    });

    return {
      customer,
      tableId: table.id,
      tableNumber: table.tableNumber,
      created: true,
    };
  });
};

export { tableAvailable, createCustomerForTable };