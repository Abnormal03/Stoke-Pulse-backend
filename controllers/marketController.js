const axios = require("axios");

// Simple in-memory cache to reduce 3rd-party rate-limit impact (429).
// Not durable, but improves UX for dev/demo and small deployments.
const topTradedCache = {
  data: null,
  fetchedAtMs: 0,
  ttlMs: 60_000, // 1 minute
};

const FALLBACK_TOP_TRADED = [
  { symbol: "AAPL", name: "Apple", price: 0, change: 0, exchange: "NASDAQ" },
  { symbol: "MSFT", name: "Microsoft", price: 0, change: 0, exchange: "NASDAQ" },
  { symbol: "NVDA", name: "NVIDIA", price: 0, change: 0, exchange: "NASDAQ" },
  { symbol: "AMZN", name: "Amazon", price: 0, change: 0, exchange: "NASDAQ" },
  { symbol: "GOOGL", name: "Alphabet", price: 0, change: 0, exchange: "NASDAQ" },
  { symbol: "META", name: "Meta", price: 0, change: 0, exchange: "NASDAQ" },
  { symbol: "TSLA", name: "Tesla", price: 0, change: 0, exchange: "NASDAQ" },
  { symbol: "JPM", name: "JPMorgan", price: 0, change: 0, exchange: "NYSE" },
];

//fetching the top traded stokes...
const topTraded = async (req, res) => {
  try {
    const now = Date.now();
    if (topTradedCache.data && now - topTradedCache.fetchedAtMs < topTradedCache.ttlMs) {
      return res.status(200).json({ symbols: topTradedCache.data, cached: true });
    }

    const response = await axios.get(
      `https://financialmodelingprep.com/stable/most-actives?apikey=${process.env.MARKET_API}`,
      { timeout: 8000 },
    );
    topTradedCache.data = response.data;
    topTradedCache.fetchedAtMs = Date.now();
    res.status(200).json({ symbols: response.data });
  } catch (error) {
    const status = error?.response?.status;
    if (status === 429 && topTradedCache.data) {
      return res.status(200).json({ symbols: topTradedCache.data, cached: true, stale: true });
    }
    if (status === 429) {
      return res.status(200).json({ symbols: FALLBACK_TOP_TRADED, fallback: true });
    }
    res.status(400).json({ error: error.message });
  }
};

//search by company name...
const searchStock = async (req, res) => {
  const { symbol } = req.params;
  try {
    const response = await axios.get(
      `https://financialmodelingprep.com/stable/search-name?query=${symbol}&apikey=${process.env.MARKET_API}`,
    );

    res.status(200).json({ searchResult: response.data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { topTraded, searchStock };
