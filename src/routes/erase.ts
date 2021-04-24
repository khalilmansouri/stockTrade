const express = require('express');
const router = express.Router();
import tradesModel from "../models/trades"


router.delete("/", async (req, res) => {
  console.log("---Erased----")
  await tradesModel.db.collection("trades")
  res.send("deleted")
})

// router.get("/", async (req, res) => {
//   console.log("---Erase----")
//   await tradesModel.db.collection("trades")
//   // console.log(ret)
//   res.send('Birds home page')
// })


export default router

