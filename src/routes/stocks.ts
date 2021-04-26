import express, { Request, Response } from "express";
import tradesModel from "../models/trades";
import StockController from "../controllers/stocks";
const router = express.Router();

// Returning the highest and lowest price for the stock symbol in the given date range
router.get("/:symbol/price", async (req: Request, res: Response) => {
	const { symbol } = req.params;
	const startDate: Date | any = req.query.startDate;
	const endDate: Date | any = req.query.endDate;

	const symbols = await tradesModel.findOne({ symbol });
	if (!symbols) return res.sendStatus(404);
	else {
		const ret = await StockController.getMinMaxPrice({symbol,startDate, endDate });
		if(Object.keys(ret)){
			return res.send(ret);
		}else
		return res.send({
			message: "There are no trades in the given date range",
		});

	}
});

// Returning the fluctuations count, maximum daily rise and maximum daily fall for each stock symbol for the period in the given date range
router.get("/stats", async (req: Request, res: Response) => {
	const start: Date | any = req.query.start;
	const end: Date | any = req.query.end;
	return res.send(await StockController.getfluctuations({start, end}));
});

export default router;
