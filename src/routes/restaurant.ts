import express from "express";
import RestaurantController from "../controllers/RestaurantController";
import { jwtCheck, jwtParse } from "../middlewares/auth";
import { validateRestaurantRequest } from "../middlewares/validation";
import multer from "multer";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});

router.post(
    "/create-restaurant",
    upload.single("imageFile"),
    validateRestaurantRequest,
    jwtCheck,
    jwtParse,
    RestaurantController.createRestaurant
);
router.put(
    "/update-restaurant",
    upload.single("imageFile"),
    validateRestaurantRequest,
    jwtCheck,
    jwtParse,
    RestaurantController.updateRestaurant
);

router.get("/get-restaurant", jwtCheck, jwtParse, RestaurantController.getRestaurant);

export default router;
