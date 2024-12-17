const express = require("express");
const router = express.Router();
const challenge = require("../models/challenge");
//const userInfo = require("../models/UserInfo");

router.get("/:username", async (req, res) => {
  try {
    const locals = {
      title: "Home Page",
      description: `A Home Page For user: ${req.params.username}`,
    };
    const userChallenges = await challenge.find();

    res.render("UserHome", { locals, userChallenges });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
