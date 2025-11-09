import {Router} from "express";

import userRoutes from "./user_routes";

const router = Router();
router.use("/users", userRoutes)

export default router