const express = require("express");

const { topTraded, searchStock } = require("../controllers/marketController");

const router = express.Router();

router.get("/toptraded", topTraded);

router.get("/search/:symbol", searchStock);

module.exports = router;
