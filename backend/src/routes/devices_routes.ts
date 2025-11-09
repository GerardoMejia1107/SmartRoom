import {Router} from "express";
import {DeviceController} from "../controllers/devices_controller";

const router = Router();

router.get('/', DeviceController.getAll)
router.get('/:id', DeviceController.getById)
router.post('/', DeviceController.create)
router.put('/:id', DeviceController.update)
router.delete('/:id', DeviceController.delete)

export default router;