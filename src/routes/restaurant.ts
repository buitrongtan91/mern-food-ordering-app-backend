import express from "express";
import RestaurantController from "../controllers/RestaurantController";
import { jwtCheck, jwtParse } from "../middlewares/auth";
import { validateRestaurantRequest } from "../middlewares/validation";
import multer from "multer";
import { param } from "express-validator";
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

router.get(
    "/search/:city",
    param("city").isString().trim().notEmpty().withMessage("City parameter must be a valid string"),
    RestaurantController.searchRestaurants
);

router.get(
    "/:id",
    param("id").isString().trim().notEmpty().withMessage("Restaurant id parameter must be a valid string"),
    RestaurantController.getRestaurantById
);

export default router;
