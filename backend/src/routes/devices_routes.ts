import {Router} from "express";
import {DeviceController} from "../controllers/devices_controller";

const router = Router();

router.get('/', DeviceController.getAll)

router.patch('/available', DeviceController.updateManualControl)

//Actualizar puerta
router.patch("/door", DeviceController.updateDoor);
//Actualizar ventana
router.patch("/window", DeviceController.updateWindow);
//Actualizar luces
router.patch(("/lights"), DeviceController.updateLights);

export default router;