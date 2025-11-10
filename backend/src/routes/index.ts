import {Router} from "express";

import userRoutes from "./user_routes";
import access_logs_routes from "./access_logs_routes";
import sensors_routes from "./sensors_routes";
import devices_routes from "./devices_routes";
import alert_routes from "./alert_routes";

const router = Router();

router.use("/users", userRoutes)
router.use("/logs", access_logs_routes)
router.use("/sensors", sensors_routes)
router.use("/devices", devices_routes)
router.use("/alerts", alert_routes)

export default router