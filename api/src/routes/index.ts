import { Router } from "express";
import menuRoutes from "./menuRoutes";
import cartRoutes from "./cartRoutes";
import authRoutes from "./authRoutes";

const router = Router();

router.use("/menu", menuRoutes);
router.use("/cart", cartRoutes);
router.use("/auth", authRoutes);

export default router;