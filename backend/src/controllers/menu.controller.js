import {
	getAllMenuItems,
	createMenuItem,
	updateMenuItem,
	deleteMenuItem,
} from "../services/menu.service.js";
import menuSchema from "../validators/menu.validator.js";

const parseNonVegQuery = (val) => {
	if (typeof val === "undefined") return undefined;
	if (typeof val === "boolean") return val;
	const s = String(val).toLowerCase();
	if (s === "true" || s === "1" || s === "yes") return true;
	if (s === "false" || s === "0" || s === "no") return false;
	if (s === "veg") return false;
	if (s === "nonveg" || s === "non_veg" || s === "non-veg") return true;
	return undefined;
};

export const getAllMenu = async (req, res) => {
	try {
		const { non_veg, category } = req.query;
		const parsedNonVeg = parseNonVegQuery(non_veg);

		const filters = {};
		if (typeof parsedNonVeg !== "undefined") filters.non_veg = parsedNonVeg;
		if (category) filters.category = category;

		const items = await getAllMenuItems(Object.keys(filters).length ? filters : {});
		return res.json(items);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const createMenu = async (req, res) => {
	try {
		const payload = { ...req.body };
		if (typeof payload.price === "string") payload.price = Number(payload.price);

		const validated = menuSchema.parse(payload);
		const created = await createMenuItem(validated);
		return res.status(201).json(created);
	} catch (err) {
		if (err.name === "ZodError") {
			return res.status(400).json({ errors: err.issues || err.errors });
		}
		console.error(err);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const updateMenu = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) return res.status(400).json({ message: "Missing id parameter" });

		const payload = { ...req.body };
		if (typeof payload.price === "string") payload.price = Number(payload.price);

		const partial = menuSchema.partial();
		const validated = partial.parse(payload);

		const updated = await updateMenuItem(id, validated);
		return res.json(updated);
	} catch (err) {
		if (err.name === "ZodError") return res.status(400).json({ errors: err.issues || err.errors });
		// Prisma 'record not found' will surface here as an error; respond 404 when appropriate
		if (err.code === "P2025") return res.status(404).json({ message: "Menu item not found" });
		console.error(err);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteMenu = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) return res.status(400).json({ message: "Missing id parameter" });

		const deleted = await deleteMenuItem(id);
		return res.json({ message: "Menu item deleted", item: deleted });
	} catch (err) {
		if (err.code === "P2025") return res.status(404).json({ message: "Menu item not found" });
		console.error(err);
		return res.status(500).json({ message: "Internal server error" });
	}
};
