import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import route from "./routes";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
    console.log("Connected to MongoDB");
});

const app = express();

app.use(express.json());
app.use(cors());

route(app);
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
