require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

//authorization middleware
const authorization = require("./middlewares/authorization");

//import all routes
const user = require("./routes/user");
const transactions = require("./routes/transactions");
const trade = require("./routes/trade");
const news = require("./routes/news");
const market = require("./routes/market");
const dashboard = require("./routes/dashboard");

const app = express();

app.use(express.json());

//handling the signup and login...
app.use("/api/user", user);

//get news...
app.use("/api/news", news);

app.use(authorization);
//get all the users transactions only
app.use("/api/transactions", transactions);

//add a transaction...
app.use("/api/trade", trade);

//dashoboard components...
app.use("/api/dashboard", dashboard);

//search for a new stoks, and display most traded...
app.use("/api/market", market);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to the database!");
  })
  .catch((error) => {
    console.log("error while connecting to the database! \n", error);
  });
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server listening at port: ", port);
});
