const express = require("express");
const { getStoreData, updateStoreData } = require("../controllers/franchiseStoreController");

const franchiseStoreRouter = express.Router();

franchiseStoreRouter.get("/getStoreData", getStoreData);
franchiseStoreRouter.put("/updateStoreData", updateStoreData)

module.exports =  franchiseStoreRouter ;