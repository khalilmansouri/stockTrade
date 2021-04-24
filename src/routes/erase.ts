const express = require('express');
import { Request, Response } from "express"
const router = express.Router();
import tradesModel from "../models/trades"


router.delete("/", async (req: Request, res: Response) => {
  await tradesModel.deleteMany({})
  res.send({})
})



export default router

