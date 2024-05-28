import { Express } from "express";
import userRouter from "./user";
import { Request, Response } from "express";

const route = (app: Express) => {
    app.use("/user", userRouter);
    app.use("/test", async (req: Request, res: Response) => {
        res.send({ message: "Hello World!" });
    });
};

export default route;
