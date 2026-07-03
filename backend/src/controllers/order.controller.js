import {
  createOrder as createOrderService,
  setOrderStatus,
  markItemServed,
  getOrderById,
  getOrdersForCustomer,
} from "../services/order.service.js";

import { prisma } from "../config/Prisma.js";

export const createOrder = async (req, res) => {
  try {
    const payload = req.body;
    // expected payload: { items: [{ menuItemId, quantity, notes? }], orderType, paymentMode, notes }
    if (!payload || !payload.items) return res.status(400).json({ message: "Missing items in body" });

    const customer = req.customer; // set by auth2Cust
    if (!customer) return res.status(401).json({ message: "Unauthorized" });

    const created = await createOrderService({
      customerId: customer.customerId,
      tableId: customer.tableId,
      orderType: payload.orderType,
      paymentMode: payload.paymentMode,
      notes: payload.notes,
      items: payload.items,
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err.message || "Internal server error" });
  }
};

export const completeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!id || !status) return res.status(400).json({ message: "Missing parameters" });

    // Only owner uses auth middleware before this controller
    const updated = await setOrderStatus(id, status);

    // Note: session invalidation for customer tokens is not implemented (JWT revocation not available).

    return res.json({ message: "Order status updated", order: updated });
  } catch (err) {
    console.error(err);
    if (err.code === "P2025") return res.status(404).json({ message: "Order not found" });
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const serveOrderItem = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    if (!orderId || !itemId) return res.status(400).json({ message: "Missing parameters" });

    // verify order exists and belongs to provided orderId
    const item = await prisma.orderItem.findUnique({ where: { id: itemId } });
    if (!item || item.orderId !== orderId) return res.status(404).json({ message: "Order item not found for this order" });

    const updated = await markItemServed({ orderId, itemId });
    return res.json({ message: "Item marked served", item: updated });
  } catch (err) {
    console.error(err);
    if (err.code === "P2025") return res.status(404).json({ message: "Order item not found" });
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Missing id" });

    const ord = await getOrderById(id);
    if (!ord) return res.status(404).json({ message: "Order not found" });
    return res.json(ord);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCustomerOrders = async (req, res) => {
  try {
    const customer = req.customer;
    if (!customer) return res.status(401).json({ message: "Unauthorized" });

    const orders = await getOrdersForCustomer(customer.customerId);
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
