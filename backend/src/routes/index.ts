import {Router} from "express";

import userRoutes from "./user_routes";
import access_logs_routes from "./access_logs_routes";

const router = Router();

router.use("/users", userRoutes)
router.use("/logs", access_logs_routes)

export default router