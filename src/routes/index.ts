import { Express } from "express";
import userRouter from "./user";
import restaurantRouter from "./restaurant";
import orderRouter from "./order";
import { Request, Response } from "express";

const route = (app: Express) => {
    app.use("/user", userRouter);
    app.use("/restaurant", restaurantRouter);
    app.use("/order", orderRouter);
    app.use("/test", async (req: Request, res: Response) => {
        res.send({ message: "Hello World!" });
    });
};

export default route;
