const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      min: 0,
      required: true,
    },
    priceAtTransaction: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["buy", "sell"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

transactionSchema.index({ userId: 1, symbol: 1, createdAt: -1 });

transactionSchema.statics.Buy = async function (
  symbol,
  quantity,
  price,
  userId,
  balance,
) {
  if (quantity <= 0) throw Error("invalid quantity");
  if (balance < price * quantity) throw Error("insufficient fund!");

  const transaction = await this.create({
    userId: userId,
    symbol: symbol,
    quantity: quantity,
    priceAtTransaction: price,
    status: "buy",
  });

  return transaction;
};

transactionSchema.statics.Sell = async function (
  symbol,
  quantity,
  price,
  userId,
) {
  if (quantity <= 0) throw Error("invalid quantity");

  const holdingsAgg = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), symbol } },
    {
      $group: {
        _id: "$symbol",
        qty: {
          $sum: {
            $cond: [
              { $eq: ["$status", "buy"] },
              "$quantity",
              { $multiply: ["$quantity", -1] },
            ],
          },
        },
      },
    },
  ]);

  const availableQuantity = holdingsAgg?.[0]?.qty ?? 0;
  if (availableQuantity - quantity < 0) throw Error("No enough stock to sell!");

  const transaction = await this.create({
    userId: userId,
    symbol: symbol,
    quantity: quantity,
    priceAtTransaction: price,
    status: "sell",
  });
  return transaction;
};

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
