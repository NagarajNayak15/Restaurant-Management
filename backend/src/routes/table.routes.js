import express from "express";
import * as tableController from "../controllers/table.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, tableController.getAllTables);
router.post("/", auth, tableController.createTable);
router.post("/:id/active", auth, tableController.setTableActive);
router.delete("/:id", auth, tableController.deleteTable);

export default router;
