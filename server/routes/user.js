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
    return res.status(401).json({ message: "Unauthorized " });
  }
  try {
    const user = await User.findOne({ username: req.params.username });
    const passwordsMatch = token.password === user.password;
    if (passwordsMatch) {
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized " });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized " });
  }
};
router.get("/:username", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Home Page",
      description: `A Home Page For user: ${req.params.username}`,
    };
    const allChallenges = await challenge.find({});
    let challengeNameArry = [];
    allChallenges.forEach((challenge) => {
      challengeNameArry.push(challenge.title);
    });
    let usersData = await userData.findOne({ username: req.params.username });
    usersData = usersData.acceptedChallenges;
    let challengeTitles = [];
    usersData.forEach((c) => {
      challengeTitles.push(c.title);
    });

    const userChallenges = await challenge.find({
      title: { $in: challengeTitles },
    });
    console.log(usersData);
    res.render("UserHome", {
      locals,
      userChallenges,
      username: req.params.username,
      layout: userLayout,
      usersData,
    });
  } catch (error) {
    console.log(error);
  }
});
router.get("/:username/acceptChallenges", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "New Chalenges",
      description: `Accept new chalenges for user: ${req.params.username}`,
    };
    const allChallenges = await challenge.find({ released: true });
    let challengeNameArry = [];
    allChallenges.forEach((challenge) => {
      challengeNameArry.push(challenge.title);
    });
    let usersData = await userData.findOne({ username: req.params.username });
    usersData = usersData.acceptedChallenges;
    let challengeTitles = [];
    usersData.forEach((c) => {
      challengeTitles.push(c.title);
    });

    let nonExeptedChallenges = challengeNameArry.filter(
      (item) => !challengeTitles.includes(item)
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
router.put(
  "/:username/addChallenge/:title",
  authMiddleware,
  async (req, res) => {
    try {
      const data = {
        title: req.params.title,
        compleated: false,
      };
      await userData.findOneAndUpdate(
        { username: req.params.username },
        { $push: { acceptedChallenges: data } }
      );
      res.redirect(`/user/${req.params.username}/acceptChallenges`);
    } catch (error) {
      console.log(error);
    }
  }
);

// update challenge to be compleated
router.put("/:username/:title", authMiddleware, async (req, res) => {
  try {
    await userData.updateOne(
      {
        username: req.params.username,
        "acceptedChallenges.title": req.params.title,
      }, // Filter for user1 and the specific challenge
      {
        $set: {
          "acceptedChallenges.$.compleated": true, // Update the "compleated" field to true
        },
      }
    );
    res.redirect(`/user/${req.params.username}/`);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
//FIX BUG WITH MAKING CHALLEGE COMPLEATED
