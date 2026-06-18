import { prisma } from "../config/Prisma.js";

const getAllMenuItems = async (filters = {}) => {
  const { non_veg, category } = filters || {};
  const where = {};

  if (typeof non_veg !== "undefined") {
    where.non_veg = non_veg;
  }

  if (category) {
    where.category = category;
  }

  return prisma.menuItem.findMany({
    where,
    orderBy: {
      name: "asc",
    },
  });
};

const createMenuItem = async (data) => {
  return prisma.menuItem.create({
    data,
  });
};

const updateMenuItem = async (id, data) => {
  return prisma.menuItem.update({
    where: { id },
    data,
  });
};

const deleteMenuItem = async (id) => {
  return prisma.menuItem.delete({
    where: { id },
  });
};

export  {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};