const express = require('express');
import { Request, Response } from "express"
const router = express.Router();
import tradesModel from "../models/trades"




router.post("/", async (req: Request, res: Response) => {
  let tra = req.body
  const trade = await tradesModel.findOne({ id: tra.id })
  if (trade) return res.sendStatus(400)
  else {
    // check fluctuation
    // fetch the last 2 transaction
    // let transaction = await tradesModel.find({ symbol: tra.symbol }).sort({ timestamp: -1 }).limit(2)
    // if (transaction.length > 0 && transaction[0].price !== tra.price) {
    //   // console.log(transaction)

    //   let pTransaction = transaction[0]
    //   // console.log(pTransaction.price)
    //   let deference = tra.price - pTransaction.price
    //   let fluctuation = 0
    //   if (transaction[1]) {
    //     let ppTransaction = transaction[1]

    //     if (pTransaction.price > tra.price && pTransaction.price > ppTransaction.price || pTransaction.price < tra.price && pTransaction.price < ppTransaction.price) {
    //       fluctuation = 1
    //       // console.log(tra.price, pTransaction.price, ppTransaction.price)
    //       // console.log(tra.timestamp, pTransaction.timestamp, ppTransaction.timestamp)
    //       // console.log("There's Fluctation")
    //     }
    //     // console.log({ symbol: tra.symbol, deference, fluctuation, timestamp: pTransaction.timestamp })
    //   }
    //   await fluctuationsModel.create({ symbol: tra.symbol, deference, fluctuation, timestamp: pTransaction.timestamp })
    // }
    // save the transction
    await tradesModel.create(req.body)
    return res.status(201).send({})
  }
})


router.get("/", async (req: Request, res: Response) => {
  // const ret = await tradesModel.find().select("-_id").sort({ id: 1 })

  const ret = await tradesModel.aggregate().project({
    _id: 0,
    id: 1, price: 1, user: 1, type: 1, shares: 1, symbol: 1,
    timestamp: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$timestamp", timezone: "+01" } },
  }).sort({ id: 1 })
  res.status(200)
  res.send(ret)
})



router.get("/users/:userID", async (req: Request, res: Response) => {
  let { userID } = req.params
  // const ret = await tradesModel.find({ "user.id": userID }).select("-_id")
  const ret = await tradesModel.aggregate().match({ "user.id": userID }).project({
    _id: 0,
    id: 1, price: 1, user: 1, type: 1, shares: 1, symbol: 1,
    timestamp: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$timestamp", timezone: "+01" } },
  }).sort({ id: 1 })
  if (ret.length === 0) res.sendStatus(404)
  else
    res.send(ret)
})

export default router

