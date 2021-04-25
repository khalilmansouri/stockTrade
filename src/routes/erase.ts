import * as express from "express";
import { Request, Response } from "express";
import tradesModel from "../models/trades";
const router = express.Router();

// 1- Erasing all the trades
router.delete("/", async (req: Request, res: Response) => {
	console.log("Erase");
	await tradesModel.deleteMany({});
	return res.send({});
});

export default router;
