const express = require('express');
const router = express.Router();
import tradesModel from "../models/trades"


router.get("/", async (req, res) => {
  console.log("---get trades----")
  const ret = await tradesModel.find()
  res.send(ret)
})

// router.get("/", async (req, res) => {
//   console.log("---Erase----")
//   await tradesModel.db.collection("trades")
//   // console.log(ret)
//   res.send('Birds home page')
// })


export default router

