import express, { Request, Response } from "express";
import asyncHandler  from "express-async-handler"
import {ITrade} from "@models/trades";
import TradesController from "@controllers/trades";

const router = express.Router();

//1- Adding new trades
router.post("/", asyncHandler(async (req: Request, res: Response) => {

		const trade = req.body as ITrade;
		const exist = await TradesController.findById(trade.id);
		if (exist) res.sendStatus(400);
		else {
			await TradesController.create(req.body);
			res.status(201).send({});
		}

}));

//3 - Returning all the trades
router.get("/", asyncHandler(async (req: Request, res: Response) => {	
	
		res.status(200);
		res.send(await	TradesController.getAll());

}));

// 4- Returning the trade records filtered by theuser ID:
router.get("/users/:userID", asyncHandler(async (req: Request, res: Response) => {

		const { userID } = req.params;
		const trades = await TradesController.getByUser(parseInt(userID));
		if (trades.length === 0)  res.sendStatus(404);
		else
			res.send(trades);

}));

export default router;