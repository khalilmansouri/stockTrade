const express = require('express');
import { Request, Response } from "express"
const router = express.Router();
import tradesModel from "../models/trades"


router.delete("/", async (req: Request, res: Response) => {
  console.log("Erase")
  await tradesModel.deleteMany({})
  return res.send({})
})



export default router

