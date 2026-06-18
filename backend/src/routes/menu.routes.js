import express from "express";
import * as menuController from "../controllers/menu.controller.js";

const router = express.Router();

router.get("/", menuController.getAllMenu);
router.post("/", menuController.createMenu);
router.put("/:id", menuController.updateMenu);
router.delete("/:id", menuController.deleteMenu);

export default router;

