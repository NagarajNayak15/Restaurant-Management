import express from "express";
import * as tableController from "../controllers/table.controller.js";
import * as customerController from "../controllers/customer.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, tableController.getAllTables);
router.get("/available/:qrToken", customerController.checkTableAvailability);
router.post("/customer/:qrToken", customerController.createCustomerForTable);
router.post("/", auth, tableController.createTable);
router.post("/:id/active", auth, tableController.setTableActive);//send isActive in body
router.delete("/:id", auth, tableController.deleteTable);

export default router;
