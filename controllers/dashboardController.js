const axios = require("axios");

const Transaction = require("../models/transactionModel");
const User = require('../models/user');
//methods for the dashboard components....
//get the chart....
const getChartData = async (req, res) => {
  const { symbol } = req.body;

  if (!symbol) {
    return res.status(400).json({ error: "Symbol is required" });
  }

  try {
    const response = await axios.get(
      `https://financialmodelingprep.com/stable/historical-price-eod/full?symbol=${symbol}&from=2025-01-01&apikey=${process.env.MARKET_API}`,
    );
    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ error: "No data found for this symbol" });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    res.status(500).json({ error: "error while fetching chart data..." });
  }
};

//get the watchlists...
const getWatchlist = async (req, res) => {
  //asumming we only use the symbols that are supported by our api...
  try {
    // using promise to wait for each fetch for each symbol...
    const response = await axios.get(
      `https://financialmodelingprep.com/stable/biggest-gainers?apikey=${process.env.MARKET_API}`,
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//trading sidebar(buy or sell a symbol/stock) can be fetched from the available datas...

//get the portfolio...
const getPortfolio = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user });

    // We use an object as a 'map' where keys are the Symbols (e.g., "AAPL")
    const portfolioMap = {};

    transactions.forEach((t) => {
      if (!portfolioMap[t.symbol]) {
        portfolioMap[t.symbol] = {
          symbol: t.symbol,
          totalQuantity: 0,
          totalCost: 0,
        };
      }
      const asset = portfolioMap[t.symbol];

      if (t.status === "buy") {
        asset.totalQuantity += t.quantity;
        asset.totalCost += t.quantity * t.priceAtTransaction;
      } else if (t.status === "sell") {
        const avgPriceBeforeSale = asset.totalCost / asset.totalQuantity;
        asset.totalQuantity -= t.quantity; //no change on the total cost...
        asset.totalCost -= t.quantity * avgPriceBeforeSale;
      }
    });

    const user = await User.findById(req.user);
    const balance = user?.balance;

    // Convert the map back into an array and filter out empty holdings
    const portfolio = Object.values(portfolioMap)
      .filter((item) => item.totalQuantity > 0)
      .map((item) => ({
        symbol: item.symbol,
        quantity: item.totalQuantity,
        avgPrice: (item.totalCost / (item.totalQuantity || 1)).toFixed(2),
      }));

    res.status(200).json({portfolio, balance});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getChartData, getWatchlist, getPortfolio };
