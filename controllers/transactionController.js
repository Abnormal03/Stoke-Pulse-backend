const Transaction = require("../models/transactionModel");

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user }).sort({
      createdAt: -1,
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = getAllTransactions;
