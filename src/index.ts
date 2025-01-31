import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import route from "./routes";
import { v2 as cloudinary } from "cloudinary";
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
    console.log("Connected to MongoDB");
});
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(cors());
app.use("/order/checkout/webhook", express.raw({ type: "*/*" }));
app.use(express.json());
route(app);
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
