import {
  getAllTables as getAllTablesService,
  createTable as createTableService,
  deleteTable as deleteTableService,
  setTableActive as setTableActiveService,
} from "../services/table.service.js";

export const getAllTables = async (req, res) => {
  try {
    const items = await getAllTablesService();
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createTable = async (req, res) => {
  try {
    const created = await createTableService();
    return res.status(201).json(created);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Table number or qrToken already exists" });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Missing id parameter" });

    const deleted = await deleteTableService(id);
    return res.json({ message: "Table deleted", table: deleted });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Table not found" });
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const setTableActive = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Missing id parameter" });

    const { isActive } = req.body;
    if (typeof isActive === "undefined") return res.status(400).json({ message: "Missing isActive in body" });

    const updated = await setTableActiveService(id, Boolean(isActive));
    return res.json({ message: "Table updated", table: updated });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Table not found" });
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
