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

const searchRestaurants = async (req: Request, res: Response) => {
    try {
        const city = req.params.city;
        const searchQuery = (req.query.searchQuery as string) || "";
        const selectedCuisines = (req.query.selectedCuisines as string) || "";
        const sortOption = (req.query.sortOption as string) || "lastUpdated";
        const page = parseInt(req.query.page as string) || 1;

        let query: any = {};
        query["city"] = new RegExp(city, "i");
        const cityCheck = await Restaurant.countDocuments(query);
        if (cityCheck === 0) {
            return res.status(404).json([]);
        }
        if (selectedCuisines) {
            const cuisinesArray = selectedCuisines.split(",").map((cuisine) => new RegExp(cuisine, "i"));
            query["cuisines"] = { $all: cuisinesArray };
        }
        if (searchQuery) {
            const searchRegex = new RegExp(searchQuery, "i");
            query["$or"] = [{ restaurantName: searchRegex }, { cuisines: { $in: [searchRegex] } }];
        }
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const restaurants = await Restaurant.find(query)
            .sort({ [sortOption]: 1 })
            .skip(skip)
            .limit(pageSize)
            .lean();

        const totalRestaurants = await Restaurant.countDocuments(query);

        const response = {
            data: restaurants,
            pagination: {
                totalRestaurants,
                page,
                pages: Math.ceil(totalRestaurants / pageSize),
            },
        };

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error searching restaurants" });
    }
};

const getRestaurantById = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        res.json(restaurant);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching restaurant" });
    }
};

export default { createRestaurant, getRestaurant, updateRestaurant, searchRestaurants, getRestaurantById };
