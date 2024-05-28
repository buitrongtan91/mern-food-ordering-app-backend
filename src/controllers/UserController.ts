import { Request, Response } from "express";
import User from "../models/User";

const createNewUser = async (req: Request, res: Response) => {
    try {
        const { auth0Id } = req.body;
        const existingUser = await User.findOne({ auth0Id });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser.toObject());
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error creating user" });
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const { name, addressLine1, country, city } = req.body;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = name;
        user.addressLine1 = addressLine1;
        user.city = city;
        user.country = country;
        await user.save();

        res.send(user.toObject());
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error updating user" });
    }
};

const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.send(user.toObject());
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching user" });
    }
};

export default {
    createNewUser,
    updateUser,
    getCurrentUser,
};
