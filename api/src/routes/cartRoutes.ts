import express from "express";
import {
	getCart,
	addCartItem,
	updateCartItem,
	deleteCartItem
} from "../controllers/cartController";

const router = express.Router();

router.get("/:cartId", getCart);
router.post("/", addCartItem);
router.put("/:cartId/item/:menuItemId", updateCartItem);
router.delete("/:cartId/item/:menuItemId", deleteCartItem);

export default router;