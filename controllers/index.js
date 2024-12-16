const { mongo } = require("mongoose");
const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const helloFunction = (req, res) => {
  res.send("Hello from my route");
};

module.exports = { helloFunction };
