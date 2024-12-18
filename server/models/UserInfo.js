const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const UserInfo = new Schema({
  user: {
    type: String,
    required: [true, "Must have user's name"],
  },
});
