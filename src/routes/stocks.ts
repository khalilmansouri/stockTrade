const express = require('express');
import { Request, Response } from "express"
const router = express.Router();
import tradesModel from "../models/trades"

// Returning the highest and lowest price for the stock symbol in the given date range
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

// Returning the fluctuations count, maximum daily rise and maximum daily fall for each stock symbol for the period in the given date range
router.get("/stats", async (req: Request, res: Response) => {
  let { start, end } = req.query;
  return res.send({})
})

export default router

