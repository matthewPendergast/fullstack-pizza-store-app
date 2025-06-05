import express from "express";
import { getUserOrders } from "../controllers/orderController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", verifyToken, getUserOrders);

export default router;