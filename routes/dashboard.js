const express = require("express");
const {
  getChartData,
  getWatchlist,
  getPortfolio,
  addWatch,
  removeWatch
} = require("../controllers/dashboardController");

const router = express.Router();

router.post("/chart", getChartData);

router.get("/portfolio", getPortfolio);

router.get("/watchlist", getWatchlist);
router.post("/watchlist/addwatch", addWatch)
router.delete('/watchlist/delete/:id', removeWatch)

module.exports = router;
