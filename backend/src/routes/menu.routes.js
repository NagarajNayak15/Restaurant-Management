import express from "express";
import * as menuController from "../controllers/menu.controller.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.get("/", menuController.getAllMenu);
router.post("/",auth, menuController.createMenu);
router.put("/:id",auth, menuController.updateMenu);
router.delete("/:id",auth, menuController.deleteMenu);

export default router;

