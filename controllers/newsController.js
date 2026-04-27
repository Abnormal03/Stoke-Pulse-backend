const axios = require("axios");

const getNews = async (req, res) => {

  const watches = req.watches ? req.watches : ["TSLA", "AMZN", "MSFT"];
  try {
    const response = await axios.get(
      `https://api.marketaux.com/v1/news/all?symbols=${encodeURIComponent(
        watches.join(","),
      )}&filter_entities=true&language=en&api_token=${process.env.NEWS_API_KEY}`,
    );

    res.status(200).json({ data: response.data });
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: "could not fetch news." });
  }
};

module.exports = getNews;
