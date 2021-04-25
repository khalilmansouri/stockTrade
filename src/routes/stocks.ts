const express = require('express');
import { Request, Response } from "express"
const router = express.Router();
import tradesModel from "../models/trades"
import moment from "moment"

// Returning the highest and lowest price for the stock symbol in the given date range
router.get("/:symbol/price", async (req: Request, res: Response) => {
  let { symbol } = req.params;
  // let { startDate, endDate } = req.query;
  let startDate: Date | any = req.query.startDate
  let endDate: Date | any = req.query.endDate

  let symbols = await tradesModel.findOne({ symbol })
  if (!symbols) return res.sendStatus(404)
  else {
    let max = await tradesModel.findOne({ symbol, timestamp: { $gte: startDate, $lte: endDate } }).sort({ price: 1 }).limit(1)
    let min = await tradesModel.findOne({ symbol, timestamp: { $gte: startDate, $lte: endDate } }).sort({ price: -1 }).limit(1)
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
  let start: Date | any = req.query.start
  let end: Date | any = req.query.end
  console.log({ start, end })
  let ret = await tradesModel.aggregate()
    .match({ timestamp: { $gte: new Date(start), $lte: new Date(moment(end).add(1, "day").toString()) } }) //
    .sort({ symbol: 1, timestamp: 1 })
    .group({
      _id: { symbol: "$symbol", date: "$timestamp" },
      symbol: { $first: "$symbol" },
      price: { $first: "$price" },
      timestamp: { $first: "$timestamp" },
    })
    .sort({ symbol: 1, timestamp: 1 })
    .group({
      _id: "$symbol",
      transactions: { $push: { price: "$price", timestamp: "$timestamp" } }
    }).sort({ _id: 1 })

  let fucArray: any[] = [];
  ret.forEach(el => {
    let fuc = {
      "fluctuations": 0,
      "max_rise": 0.0,
      "max_fall": 0.0
    }
    fuc["symbol"] = el._id

    if (el.transactions.length > 2) {
      let max_rise = 0
      let max_fall = 0
      for (let i = 1; i < el.transactions.length; i++) {
        let def = parseFloat((el.transactions[i].price - el.transactions[i - 1].price).toFixed(2))
        if (def > max_rise) max_rise = def
        if (def < max_fall) max_fall = def
      }
      fuc["max_rise"] = max_rise
      fuc["max_fall"] = -max_fall

      for (let i = 2; i < el.transactions.length; i++) {
        let first = el.transactions[i].price
        let second = el.transactions[i - 1].price
        let third = el.transactions[i - 2].price

        if (second > first && second > third || second < first && second < third) {
          fuc["fluctuations"] = fuc["fluctuations"] + 1
        }
      }

    } else if (el.transactions.length == 2) {
      let def = el.transactions[1].price - el.transactions[0].price
      def = parseFloat(def.toFixed(2))
      def > 0 ? fuc["max_rise"] = def : fuc["max_fall"] = -def
    }

    fucArray.push(fuc)
  })
  let totalStock = await tradesModel.aggregate().sort({ symbol: 1 }).group({ _id: "$symbol", symbol: { $first: "$symbol" } })

  let finaleResult: any[] = []
  totalStock.forEach((stock) => {
    let exist = fucArray.find(fuc => fuc.symbol === stock.symbol)
    if (exist)
      finaleResult.push(exist)
    else
      finaleResult.push({
        symbol: stock.symbol,
        message: "There are no trades in the given date range"
      })
  })

  return res.json(finaleResult)
})

export default router

