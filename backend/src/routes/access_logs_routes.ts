import {Router} from "express";
import {AcessLogsController} from "../controllers/acess_logs_controller";

const router = Router();

router.get("/", AcessLogsController.getAll);
router.get("/:id", AcessLogsController.getById);
router.post("/", AcessLogsController.create);
router.put("/:id", AcessLogsController.update);
router.delete("/:id", AcessLogsController.delete);

export default router;