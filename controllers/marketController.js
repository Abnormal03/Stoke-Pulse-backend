const axios = require("axios");

//fetching the top traded stokes...
const topTraded = async (req, res) => {
  try {
    const response = await axios.get(
      `https://financialmodelingprep.com/stable/most-actives?apikey=${process.env.MARKET_API}`,
    );
    res.status(200).json({ symbols: response.data });
  } catch (error) {
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
