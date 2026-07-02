import { prisma } from "../config/Prisma.js";

const tableAvailable = async (qrToken) => {
  const table = await prisma.table.findFirst({
    where: { qrToken },
    select: { isActive: true },
  });

  return Boolean(table?.isActive);
};

const createCustomer = async (name, phone) => {

  const existingCustomer = await prisma.customer.findFirst({
    where: { phone },
    select: { id: true, name: true, phone: true },
  });

  if (existingCustomer) {
    if (name && existingCustomer.name !== name) {
      return prisma.customer.update({
        where: { id: existingCustomer.id },
        data: { name },
        select: { id: true, name: true, phone: true },
      });
    }

    return existingCustomer;
  }

  return prisma.customer.create({
    data: { name, phone },
    select: { id: true, name: true, phone: true },
  });
};



export { tableAvailable, createCustomer };