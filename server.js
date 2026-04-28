require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

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

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));

//deployment ready...
const allowedOrigins = [
  'https://stock-pulse-frontend-murex.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Blocked Origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

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

const port = process.env.PORT || 3000;

async function start() {
  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI in environment");
  }
  if (!process.env.SECRET) {
    throw new Error("Missing SECRET in environment");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("connected to the database!");

  const server = app.listen(port, () => {
    console.log("server listening at port: ", port);
  });

  const shutdown = async () => {
    server.close(() => { });
    await mongoose.connection.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
