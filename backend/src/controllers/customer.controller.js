import jwt from "jsonwebtoken";
import {
  tableAvailable,
  createCustomerForTable as authenticateCustomerForTable,
} from "../services/customer.service.js";

const JWT_SECRET = process.env.JWT_SECRET || "restaurant-secret";

export const checkTableAvailability = async (req, res) => {
  try {
    const { qrToken } = req.params;

    if (!qrToken) {
      return res.status(400).json({ message: "qrToken is required" });
    }

    const table = await tableAvailable(qrToken);
    return res.json(table);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createCustomerForTable = async (req, res) => {
  try {
    const { qrToken } = req.params;
    const { name, phone } = req.body ?? {};

    if (!qrToken) {
      return res.status(400).json({ message: "qrToken is required" });
    }

    if (typeof phone !== "string" || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Enter a valid 10-digit phone number" });
    }

    if (name !== undefined && typeof name !== "string") {
      return res.status(400).json({ message: "Name must be text" });
    }

    const normalizedName = typeof name === "string" ? name.trim() : "";

    if (normalizedName.length > 100) {
      return res.status(400).json({ message: "Name must be 100 characters or fewer" });
    }

    const result = await authenticateCustomerForTable(qrToken, phone, normalizedName);

    if (result.needsName) {
      return res.json({ needsName: true });
    }

    const token = jwt.sign(
      {
        sub: result.customer.id,
        customerId: result.customer.id,
        tableId: result.tableId,
        tableNumber: result.tableNumber,
        phone: result.customer.phone,
        type: "customer-session",
      },
      JWT_SECRET,
      { expiresIn: "3h" }
    );

    return res.status(result.created ? 201 : 200).json({
      message: result.created ? "Customer created and table reserved" : "Customer signed in and table reserved",
      customer: result.customer,
      tableNumber: result.tableNumber,
      token,
      expiresIn: "3h",
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
