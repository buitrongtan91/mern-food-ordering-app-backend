import express from "express";
import userController from "../controllers/UserController";
import { jwtCheck, jwtParse } from "../middlewares/auth";
import { validateUserRequest } from "../middlewares/validation";
const router = express.Router();

router.get("/get-current-user", jwtCheck, jwtParse, userController.getCurrentUser);
router.post("/create-new-user", jwtCheck, userController.createNewUser);
router.put("/update-user", jwtCheck, jwtParse, validateUserRequest, userController.updateUser);

export default router;
