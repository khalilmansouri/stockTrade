import { Request, Response } from "express";
import tradesModel from "../models/trades";
import * as express from "express";
const router = express.Router();

//1- Adding new trades
router.post("/", async (req: Request, res: Response) => {
	const tra = req.body;
	const trade = await tradesModel.findOne({ id: tra.id });
	if (trade) return res.sendStatus(400);
	else {
		await tradesModel.create(req.body);
		return res.status(201).send({});
	}
});

//3 - Returningallthetrades
router.get("/", async (req: Request, res: Response) => {

	// const ret = await tradesModel.find().select("-_id").sort({ id: 1 })
	const ret = await tradesModel
		.aggregate()
		.project({
			_id: 0,
			id: 1,
			price: 1,
			user: 1,
			type: 1,
			shares: 1,
			symbol: 1,
			timestamp: {
				$dateToString: {
					format: "%Y-%m-%d %H:%M:%S",
					date: "$timestamp",
					timezone: "+01"
				}
			}
		})
		.sort({ id: 1 });
	res.status(200);
	res.send(ret);
});

// 4- ReturningthetraderecordsfilteredbytheuserID:
router.get("/users/:userID", async (req: Request, res: Response) => {
	const { userID } = req.params;
	// const ret = await tradesModel.find({ "user.id": userID }).select("-_id")
	const ret = await tradesModel
		.aggregate()
		.match({ "user.id": parseInt(userID) })
		.project({
			_id: 0,
			id: 1,
			price: 1,
			user: 1,
			type: 1,
			shares: 1,
			symbol: 1,
			timestamp: {
				$dateToString: {
					format: "%Y-%m-%d %H:%M:%S",
					date: "$timestamp",
					timezone: "+01"
				}
			}
		})
		.sort({ id: 1 });
	// if no result found return 404
	if (ret.length === 0) return res.sendStatus(404);
	else
		return res.send(ret);
});

export default router;