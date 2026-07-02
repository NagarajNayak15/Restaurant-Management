import jwt from "jsonwebtoken";
import { tableAvailable, createCustomer } from "../services/customer.service.js";
import { prisma } from "../config/Prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "restaurant-secret";

export const checkTableAvailability = async (req, res) => {
  try {
    const { qrToken } = req.params;

    if (!qrToken) {
      return res.status(400).json({ message: "qrToken is required" });
    }

    const available = await tableAvailable(qrToken);
    return res.json({ available });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createCustomerForTable = async (req, res) => {
  try {
    const { qrToken } = req.params;
    const { name, phone } = req.body;

    if (!qrToken) {
      return res.status(400).json({ message: "qrToken is required" });
    }

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const table = await prisma.table.findFirst({
      where: { qrToken },
      select: { id: true, isActive: true },
    });

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    if (!table.isActive) {
      return res.status(400).json({ message: "Table is not active" });
    }

    const customer = await createCustomer(name, phone);

    await prisma.table.update({
      where: { id: table.id },
      data: { isActive: false },
    });

    const token = jwt.sign(
      {
        sub: customer.id,
        customerId: customer.id,
        tableId: table.id,
        phone,
        type: "customer-session",
      },
      JWT_SECRET,
      { expiresIn: "3h" }
    );

    return res.status(201).json({
      message: "Customer created and table reserved",
      customer,
      token,
      expiresIn: "3h",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
