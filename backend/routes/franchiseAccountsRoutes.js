const express = require("express");
const { getAllOrders, updatePaymentStatus, getVerifications, getRejections } = require("../controllers/franchiseAccountsController");

const franchiseAccountsRouter = express.Router();

franchiseAccountsRouter.get("/getAllOrders", getAllOrders)
franchiseAccountsRouter.post("/updatePaymentStatus", updatePaymentStatus)
franchiseAccountsRouter.get("/getVerifications", getVerifications)
franchiseAccountsRouter.get("/getRejections", getRejections)


module.exports =  franchiseAccountsRouter ;