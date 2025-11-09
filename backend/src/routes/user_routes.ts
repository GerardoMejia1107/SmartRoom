import {Router} from "express";
import {UserController} from "../controllers/user_controller";

const router = Router();

// GET all users
router.get("/", UserController.getAll);

// GET user by ID
router.get("/:id", UserController.getById);

// CREATE new user
router.post("/", UserController.create);

// UPDATE user
router.put("/:id", UserController.update);

// DELETE user
router.delete("/:id", UserController.delete);

export default router;
