const mongoose = require("mongoose");

const watchlistSchema = mongoose.Schema({
  Symbol: {
    type: String,
    required: true,
  },
});

watchlistSchema.statics.addWatch = async (symbol) => {
  if (!symbol) {
    throw Error("symbol name is required!");
  }

  try {
    const newWatch = await this.create({
      symbol,
    });
    return newWatch;
  } catch (error) {
    throw Error(error.message);
  }
};

watchlistSchema.statics.removeWatch = async (_id) => {
  if (!_id) {
    throw Error("id name is required!");
  }
  try {
    const removed = await this.findByIdAndDelete(_id);

    return removed;
  } catch (error) {
    throw Error(error.message);
  }
};
const watchlist = mongoose.model("watchlist", watchlistSchema);

module.exports = watchlist;
