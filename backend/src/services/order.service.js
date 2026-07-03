import { prisma } from "../config/Prisma.js";

const TAX_RATE = 0.10; // 10% tax

const createOrder = async ({ customerId, tableId, orderType, paymentMode, notes, items }) => {
  // items: [{ menuItemId, quantity, notes? }]
  if (!items || !Array.isArray(items) || items.length === 0) throw new Error("No items provided");

  // fetch menu items
  const menuIds = items.map((i) => i.menuItemId);
  const menuRecords = await prisma.menuItem.findMany({ where: { id: { in: menuIds } } });
  const menuMap = new Map(menuRecords.map((m) => [m.id, m]));

  const orderItemsData = items.map((it) => {
    const menu = menuMap.get(it.menuItemId);
    if (!menu) throw new Error(`Menu item not found: ${it.menuItemId}`);
    const unitPrice = Number(menu.price);
    const quantity = Number(it.quantity) || 1;
    const totalPrice = unitPrice * quantity;
    return {
      menuItemId: it.menuItemId,
      quantity,
      unitPrice: unitPrice.toString(),
      totalPrice: totalPrice.toString(),
      notes: it.notes || null,
    };
  });

  const subtotal = orderItemsData.reduce((s, it) => s + Number(it.totalPrice), 0);
  const taxAmount = +(subtotal * TAX_RATE).toFixed(2);
  const totalAmount = +(subtotal + taxAmount).toFixed(2);

  const created = await prisma.order.create({
    data: {
      customerId: customerId || null,
      tableId,
      orderType: orderType || null,
      paymentMode: paymentMode || null,
      status: "active",
      paymentStatus: "pending",
      subtotal: subtotal.toString(),
      taxAmount: taxAmount.toString(),
      totalAmount: totalAmount.toString(),
      notes: notes || null,
      orderItems: {
        create: orderItemsData.map((it) => ({
          menuItemId: it.menuItemId,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          totalPrice: it.totalPrice,
          notes: it.notes,
        })),
      },
    },
    include: { orderItems: true },
  });

  return created;
};

const setOrderStatus = async (orderId, status) => {
  const updated = await prisma.order.update({ where: { id: orderId }, data: { status } });
  // if deactivating, set table active
  if (status === "inactive") {
    const ord = await prisma.order.findUnique({ where: { id: orderId }, select: { tableId: true } });
    if (ord?.tableId) {
      await prisma.table.update({ where: { id: ord.tableId }, data: { isActive: true } });
    }
  }
  return updated;
};

const markItemServed = async ({ orderId, itemId }) => {
  const updated = await prisma.orderItem.update({
    where: { id: itemId },
    data: { isServed: true },
  });
  return updated;
};

const getOrderById = async (id) => {
  return prisma.order.findUnique({ where: { id }, include: { orderItems: true } });
};

const getOrdersForCustomer = async (customerId) => {
  return prisma.order.findMany({ where: { customerId }, include: { orderItems: true }, orderBy: { createdAt: "desc" } });
};

export { createOrder, setOrderStatus, markItemServed, getOrderById, getOrdersForCustomer };
