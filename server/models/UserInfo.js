const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const UserInfo = new Schema({
  username: {
    type: String,
    required: [true, "Must have user's name"],
  },
  acceptedChallenges: {
    type: Array,
  },
});

module.exports = mongoose.model("UserInfo", UserInfo);
