import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const validateUserRequest = [
    body("email").isEmail().notEmpty().withMessage("Email must be a string"),
    body("name").isString().notEmpty().withMessage("Name must be a string"),
    body("addressLine1").isString().notEmpty().withMessage("AddressLine1 must be a string"),
    body("city").isString().notEmpty().withMessage("City must be a string"),
    body("country").isString().notEmpty().withMessage("Country must be a string"),
    handleValidationErrors,
];

export const validateRestaurantRequest = [
    body("restaurantName").isString().notEmpty().withMessage("Restaurant Name must be a string"),
    body("city").isString().notEmpty().withMessage("City must be a string"),
    body("country").isString().notEmpty().withMessage("Country must be a string"),
    body("deliveryPrice").isFloat({ min: 0 }).notEmpty().withMessage("Delivery Price must be a number"),
    body("estimatedDeliveryTime").isInt({ min: 0 }).notEmpty().withMessage("Estimated Delivery Time must be a number"),
    body("cuisines")
        .isArray()
        .withMessage("Cuisines must be an array of array")
        .notEmpty()
        .withMessage("Cuisines  array cannot be empty"),
    body("menuItems").isArray().withMessage("Menu Items must be an array of array"),
    body("menuItems.*.name").isString().notEmpty().withMessage("Menu Item Name must be a string"),
    body("menuItems.*.price").isFloat({ min: 0 }).notEmpty().withMessage("Menu Item Price must be a number"),
    handleValidationErrors,
];
