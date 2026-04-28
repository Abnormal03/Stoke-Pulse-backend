const mongoose = require("mongoose");

const watchlistSchema = mongoose.Schema({
  symbol: {
    type: String,
    required: true,
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }
});

watchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

watchlistSchema.statics.addWatch = async function (symbol, userId){
  if (!symbol) {
    throw Error("symbol name is required!");
  }

  try {
    //check if it already exists...
    const exists = await this.findOne({ symbol: symbol, userId: userId });
    if (exists) throw Error("Stock already in watchlist");

    const newWatch = await this.create({
      symbol,
      userId
    });
    return newWatch;
  } catch (error) {
    throw Error(error.message);
  }
};

watchlistSchema.statics.removeWatch= async function(_id){
  if (!_id) {
    throw Error("symbol id is required!");
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
