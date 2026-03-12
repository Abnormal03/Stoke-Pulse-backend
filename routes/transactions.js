const express = require("express");

const getAllTransactions = require("../controllers/transactionController");

const router = express.Router();

//getting all the transactions...
router.get("/", getAllTransactions);

module.exports = router;
