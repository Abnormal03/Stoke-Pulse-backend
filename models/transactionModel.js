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

transactionSchema.statics.Buy = async function (
  symbol,
  quantity,
  price,
  userId,
  balance,
) {
  if (quantity == 0) throw Error("invalid quantity");
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
  if (quantity == 0) throw Error("invalid quantity");
  const available = await this.find({ symbol: symbol });
  if (!available) throw Error("No available stock to sell!");
  let availableQuantity = 0;
  available.map((symbol) => {
    symbol.status === "buy"
      ? (availableQuantity += symbol.quantity)
      : (availableQuantity -= symbol.quantity);
  });
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
