import {SensorController} from "../controllers/sensors_controller";
import {Router} from "express";

const router = Router();

router.get("/", SensorController.getAll);
router.get("/:id", SensorController.getById);
router.post("/", SensorController.create);
router.put("/:id", SensorController.update);
router.delete("/:id", SensorController.delete);

export default router;