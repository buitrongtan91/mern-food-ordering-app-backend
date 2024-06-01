import { Request, Response } from "express";
import Restaurant from "../models/Restaurant";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

const createRestaurant = async (req: Request, res: Response) => {
    try {
        const existingRestaurant = await Restaurant.findOne({ user: req.userId });

        if (existingRestaurant) {
            return res.status(409).json({ message: "Restaurant already exists" });
        }

        const image = req.file as Express.Multer.File;
        const base64Image = Buffer.from(image.buffer).toString("base64");
        const dataURI = `data:${image.mimetype};base64,${base64Image}`;

        const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

        const restaurant = new Restaurant(req.body);
        restaurant.imageUrl = uploadResponse.url;
        restaurant.lastUpdated = new Date();
        restaurant.user = new mongoose.Types.ObjectId(req.userId);

        await restaurant.save();

        res.status(201).send(restaurant);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.userId });

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        res.json(restaurant);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching restaurant" });
    }
};

const updateRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.userId });

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        restaurant.restaurantName = req.body.restaurantName;
        restaurant.city = req.body.city;
        restaurant.country = req.body.country;
        restaurant.deliveryPrice = req.body.deliveryPrice;
        restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
        restaurant.cuisines = req.body.cuisines;
        restaurant.menuItems = req.body.menuItems;
        restaurant.lastUpdated = new Date();

        if (req.file) {
            const image = req.file as Express.Multer.File;
            const base64Image = Buffer.from(image.buffer).toString("base64");
            const dataURI = `data:${image.mimetype};base64,${base64Image}`;

            const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
            restaurant.imageUrl = uploadResponse.url;
        }
        await restaurant.save();

        res.status(200).send(restaurant);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error update restaurant" });
    }
};

export default { createRestaurant, getRestaurant, updateRestaurant };
