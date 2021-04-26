import * as express from "express";
import asyncHandler  from "express-async-handler"
import { Request, Response } from "express";
import TradesController from "@controllers/trades"
const router = express.Router();

// 1- Erasing all the trades
router.delete("/", asyncHandler(async (req: Request, res: Response) => {
	await TradesController.erase();
	return res.send({});
}));

export default router;
