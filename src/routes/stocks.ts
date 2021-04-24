const express = require('express');
import { Request, Response } from "express"
const router = express.Router();
import tradesModel from "../models/trades"

// ​/stocks/stats?start={startDate}&end={endDate}​
// ​/stocks/{stockSymbol}/price?start={startDate}&end={endDate}​
router.get("/:symbol/price", async (req: Request, res: Response) => {
  let { symbol } = req.params;
  let { startDate, endDate } = req.query;
  let symbols = await tradesModel.findOne({ symbol })
  if (!symbols) return res.sendStatus(404)
  else {
    let max = await tradesModel.findOne({ symbol, timestamp: { $gte: startDate?.toString(), $lte: endDate?.toString() } }).sort({ price: 1 }).limit(1)
    let min = await tradesModel.findOne({ symbol, timestamp: { $gte: startDate?.toString(), $lte: endDate?.toString() } }).sort({ price: -1 }).limit(1)
    if (max && min) {
      res.status(400);
      return res.send({ message: "There are no trades in the given date range" })
    } else {
      return res.send({ lowest: min?.price, highest: max?.price, symbol })
    }
  }
})



export default router

