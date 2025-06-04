import { Router } from "express";
import menuRoutes from "./menuRoutes";
import cartRoutes from "./cartRoutes";

const router = Router();

router.use("/menu", menuRoutes);
router.use("/cart", cartRoutes);

export default router;