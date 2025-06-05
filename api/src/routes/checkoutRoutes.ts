import express from "express";
import { checkout } from "../controllers/checkoutController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();
router.post("/", verifyToken, checkout);

export default router;