const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const challenge = require("../models/challenge");
const userData = require("../models/UserInfo");
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
    const passwordsMatch = token.password === user.password;
    if (passwordsMatch) {
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
    const userChallenges = await challenge.find({ released: true });
    res.render("UserHome", { locals, userChallenges, layout: userLayout });
  } catch (error) {
    console.log(error);
  }
});
router.get("/:username/acceptChallenges", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Accept new chalenges page",
      description: `Accept new chalenges for user: ${req.params.username}`,
    };
    const allChallenges = await challenge.find({});
    let challengeNameArry = [];
    allChallenges.forEach((challenge) => {
      challengeNameArry.push(challenge.title);
    });
    let usersData = await userData.findOne({ username: req.params.username });
    usersData = usersData.acceptedChallenges;

    let nonExeptedChallenges = challengeNameArry.filter(
      (item) => !usersData.includes(item)
    );
    console.log(nonExeptedChallenges);
    let challengeArray = [];
    challengeArray = await challenge.find({
      title: { $in: nonExeptedChallenges },
    });
    res.render("acceptChallenges", { locals, challengeArray });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
