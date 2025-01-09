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
  minDayReq: {
    type: Number,
    default: 0,
  },
  compleated: {
    type: Object,
    default: { compleated: 0, accepted: 0 },
  },
});

module.exports = mongoose.model("Challenge", challengeSchema);
