import {Router} from "express";
import {AlertController} from "../controllers/alerts_controller";

const router = Router();

router.get('/', AlertController.getAll)
router.get('/:id', AlertController.getById)
router.post('/', AlertController.create)
router.put('/:id', AlertController.update)
router.delete('/:id', AlertController.delete)

export default router;