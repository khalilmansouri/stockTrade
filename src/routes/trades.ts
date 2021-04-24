const express = require('express');
import { Request, Response } from "express"
const router = express.Router();
import tradesModel from "../models/trades"




router.post("/", async (req: Request, res: Response, next) => {
  // try {
  let tra = req.body
  const trade = await tradesModel.findOne({ id: tra.id })
  if (trade) return res.sendStatus(400)
  else {
    await tradesModel.create(req.body)
    return res.status(201).send({})
  }
  // } catch (error) {
  //   next(error)
  // }

})


router.get("/", async (req: Request, res: Response) => {
  const ret = await tradesModel.find().select("-_id").sort({ id: 1 })
  res.status(200)
  res.send(ret)
})



router.get("/users/:userID", async (req: Request, res: Response) => {
  let { userID } = req.params
  const ret = await tradesModel.find({ "user.id": userID }).select("-_id")
  if (ret.length === 0) res.sendStatus(404)
  else
    res.send(ret)
})

export default router

