import { Request, Response } from "express";
import {ITrade} from "../models/trades";
import TradesController from "../controllers/trades";
import * as express from "express";
const router = express.Router();

//1- Adding new trades
router.post("/", async (req: Request, res: Response) => {
	const trade = req.body as ITrade;
	const exist = await TradesController.findById(trade.id);
	if (exist) return res.sendStatus(400);
	else {
		await TradesController.create(req.body);
		return res.status(201).send({});
	}
});

//3 - Returning all the trades
router.get("/", async (req: Request, res: Response) => {	
	res.status(200);
	res.send(await	TradesController.getAll());
});

// 4- Returning the trade records filtered by theuser ID:
router.get("/users/:userID", async (req: Request, res: Response) => {
	const { userID } = req.params;
	// let trades : ITrade[] = [];
	const trades = await TradesController.getByUser(parseInt(userID));
	if (trades.length === 0) return res.sendStatus(404);
	else
		return res.send(trades);
});

export default router;