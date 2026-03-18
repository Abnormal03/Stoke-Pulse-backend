const express = require("express");
const {
  getChartData,
  getWatchlist,
  getPortfolio,
} = require("../controllers/dashboardController");

const router = express.Router();

router.post("/chart", getChartData);
router.get("/watchlist", getWatchlist);

router.get("/portfolio", getPortfolio);

module.exports = router;
