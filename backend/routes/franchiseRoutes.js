const express = require("express");
const { uploadItems, getAllItems, deleteItem, updateItem, allOrders, updateOrderStatus } = require("../controllers/franchiseController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the folder path
const uploadFolder = path.join(__dirname, "..", "Franchise");

// Ensure 'uploads' folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

const franchiseRouter = express.Router();

franchiseRouter.post("/uploadItems", upload.single("productImage"), uploadItems);
franchiseRouter.get("/allItems", getAllItems)
franchiseRouter.delete("/allItems/:id", deleteItem)
franchiseRouter.put("/allItems/:id", updateItem)
franchiseRouter.get("/allOrders", allOrders)
franchiseRouter.post("/updateOrderStatus", updateOrderStatus)


module.exports = franchiseRouter;
