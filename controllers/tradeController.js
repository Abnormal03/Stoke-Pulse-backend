const User = require("../models/user");
const Transaction = require("../models/transactionModel");

const buyStock = async (req, res) => {
  const { symbol, quantity, price } = req.body;
  const userId = req.user;

  try {
    //get the user and if he/she had a sufficient balance...
    const user = await User.findOne({ _id: userId });
    //create the transaction....
    const transaction = await Transaction.Buy(
      symbol,
      quantity,
      price,
      userId,
      user.balance,
    );

    const cost = quantity * price;

    //update the user balance...
    user.balance -= cost;
    await user.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const sellStock = async (req, res) => {
  const { symbol, quantity, price } = req.body;
  const userId = req.user;

  try {
    //get the user and if he/she had a sufficient fund...
    const user = await User.findOne({ _id: userId });
    //create the transaction....
    const transaction = await Transaction.Sell(symbol, quantity, price, userId);

    const worth = quantity * price;

    //update the user balance...
    user.balance += worth;
    await user.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { buyStock, sellStock };
