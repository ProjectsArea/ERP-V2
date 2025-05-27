const express = require("express");
const { getAllProducts, buyNow, buyAll, getHistory } = require("../controllers/franchiseUserController");

const franchiseUserRouter = express.Router();

franchiseUserRouter.get("/getAllProducts", getAllProducts)
franchiseUserRouter.post("/buyNow", buyNow);
franchiseUserRouter.post("/buyAll", buyAll);
franchiseUserRouter.post("/getHistory", getHistory)

module.exports =  franchiseUserRouter ;