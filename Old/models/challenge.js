const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const challengeSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  desc: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Challenge", challengeSchema);
