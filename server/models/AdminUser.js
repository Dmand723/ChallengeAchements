const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const AdminUserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("AdminUser", AdminUserSchema);
