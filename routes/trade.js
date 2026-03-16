const express = require("express");
const { buyStock, sellStock } = require("../controllers/tradeController");

const router = express.Router();

router.post("/buy", buyStock);

router.post("/sell", sellStock);

module.exports = router;
