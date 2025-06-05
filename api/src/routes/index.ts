import { Router } from "express";
import menuRoutes from "./menuRoutes";
import cartRoutes from "./cartRoutes";
import authRoutes from "./authRoutes";
import checkoutRoutes from "./checkoutRoutes";
import orderRoutes from "./orderRoutes";

const router = Router();

router.use("/menu", menuRoutes);
router.use("/cart", cartRoutes);
router.use("/auth", authRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/orders", orderRoutes);

export default router;