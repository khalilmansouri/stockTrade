import express, { Request, Response } from "express";
import {ITrade} from "@models/trades";
import TradesController from "@controllers/trades";

const router = express.Router();

//1- Adding new trades
router.post("/", async (req: Request, res: Response, next) => {
	try {
		const trade = req.body as ITrade;
		const exist = await TradesController.findById(trade.id);
		if (exist) res.sendStatus(400);
		else {
			await TradesController.create(req.body);
			res.status(201).send({});
		}
	} catch (error) {
		next(error);
	}

});

//3 - Returning all the trades
router.get("/", async (req: Request, res: Response, next) => {	
	try {
		res.status(200);
		res.send(await	TradesController.getAll());
	} catch (error) {
		console.log(error);
		next(error);
	}

});

// 4- Returning the trade records filtered by theuser ID:
router.get("/users/:userID", async (req: Request, res: Response, next) => {
	try {
		const { userID } = req.params;
		const trades = await TradesController.getByUser(parseInt(userID));
		if (trades.length === 0)  res.sendStatus(404);
		else
			res.send(trades);
	} catch (error) {
		console.log(error);
		next(error);
	}

});

export default router;