const express = require("express");
const { getStoreData, updateStoreData, addStoreData } = require("../controllers/franchiseStoreController");

const franchiseStoreRouter = express.Router();

franchiseStoreRouter.get("/getStoreData", getStoreData);
franchiseStoreRouter.put("/updateStoreData", updateStoreData);
franchiseStoreRouter.post("/addStoreData", addStoreData)

module.exports =  franchiseStoreRouter ;