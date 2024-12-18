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
  category: {
    type: String,
    required: true,
  },
  released: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Challenge", challengeSchema);
