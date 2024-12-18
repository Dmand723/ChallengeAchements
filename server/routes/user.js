const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const challenge = require("../models/challenge");
const User = require("../models/user");
//const userInfo = require("../models/UserInfo");\
const userLayout = "../views/layouts/user.ejs";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const user = await User.findOne({ username: req.params.username });
    const usernameMatch = token.username === user.username;
    const passwordsMatch = token.password === user.password;
    if (passwordsMatch && usernameMatch) {
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
router.get("/:username", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Home Page",
      description: `A Home Page For user: ${req.params.username}`,
    };
    const userChallenges = await challenge.find();
    res.render("UserHome", { locals, userChallenges, layout: userLayout });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
