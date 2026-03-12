const axios = require("axios");

const getNews = async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.marketaux.com/v1/news/all?symbols=TSLA%2CAMZN%2CMSFT&filter_entities=true&language=en&api_token=${process.env.NEWS_API_KEY}`,
    );

    res.status(200).json({ data: response.data });
  } catch (error) {
    res.status(400).json({ error: "could not fetch news." });
  }
};

module.exports = getNews;
