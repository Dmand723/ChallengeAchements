const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const challenge = require("../models/challenge");
const userData = require("../models/UserInfo");
const User = require("../models/User");
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
//user home showing all challenges
router.get("/:username", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Home Page",
      description: `A Home Page For user: ${req.params.username} (all challenges)`,
    };
    const allChallenges = await challenge.find({ released: true });
    let challengeNameArry = [];
    allChallenges.forEach((challenge) => {
      challengeNameArry.push(challenge.title);
    });
    let usersData = await userData.findOne({
      username: req.params.username,
    });
    usersData = usersData.acceptedChallenges;
    //check if challenge can be compleated
    // Convert strings to Date objects
    usersData.forEach((c) => {
      let dateToComplete = c.minDateToComplete;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (today >= dateToComplete) {
        userData.updateOne(
          {
            username: req.params.username,
            "acceptedChallenges.title": c.title,
          }, // Filter for user1 and the specific challenge
          {
            $set: {
              "acceptedChallenges.$.canComplete": true,
            },
          }
        );
      } else {
        userData.updateOne(
          {
            username: req.params.username,
            "acceptedChallenges.title": c.title,
          }, // Filter for user1 and the specific challenge
          {
            $set: {
              "acceptedChallenges.$.canComplete": false,
            },
          }
        );
      }
    });
    usersData = usersData.reverse();
    let challengeTitles = [];
    usersData.forEach((c) => {
      challengeTitles.push(c.title);
    });

    const userChallenges = await challenge.find({
      title: { $in: challengeTitles },
    });
    res.render("UserHome", {
      locals,
      userChallenges,
      username: req.params.username,
      layout: userLayout,
      usersData,
      optionsClass: {
        all: "challenge-options-all option-selected",
        completed: "challenge-options-completed",
        incomplete: "challenge-options-incomplete",
      },
    });
  } catch (error) {
    console.log(error);
  }
});

//Veiw challenges that are completed
router.get("/:username/completed", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Home Page",
      description: `A Home Page For user: ${req.params.username} (completed challenges)`,
    };
    const allChallenges = await challenge.find({});
    let challengeNameArry = [];
    allChallenges.forEach((challenge) => {
      challengeNameArry.push(challenge.title);
    });
    let usersData = await userData.findOne({
      username: req.params.username,
    });

    usersData = usersData.acceptedChallenges;
    usersData = usersData.reverse();
    usersData = usersData.filter((c) => c.compleated == true);
    let challengeTitles = [];
    usersData.forEach((c) => {
      challengeTitles.push(c.title);
    });
    const userChallenges = await challenge.find({
      title: { $in: challengeTitles },
    });
    res.render("UserHome", {
      locals,
      userChallenges,
      username: req.params.username,
      layout: userLayout,
      usersData,
      optionsClass: {
        all: "challenge-options-all ",
        completed: "challenge-options-completed option-selected",
        incomplete: "challenge-options-incomplete",
      },
    });
  } catch (error) {
    console.log(error);
  }
});
//Veiw challenges that are incomplete
router.get("/:username/incomplete", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Home Page",
      description: `A Home Page For user: ${req.params.username} (incomplete challenges)`,
    };
    const allChallenges = await challenge.find({});
    let challengeNameArry = [];
    allChallenges.forEach((challenge) => {
      challengeNameArry.push(challenge.title);
    });
    let usersData = await userData.findOne({
      username: req.params.username,
    });
    usersData = usersData.acceptedChallenges;
    usersData = usersData.reverse();
    usersData = usersData.filter((c) => c.compleated == false);
    let challengeTitles = [];
    usersData.forEach((c) => {
      challengeTitles.push(c.title);
    });

    const userChallenges = await challenge.find({
      title: { $in: challengeTitles },
    });
    res.render("UserHome", {
      locals,
      userChallenges,
      username: req.params.username,
      layout: userLayout,
      usersData,
      optionsClass: {
        all: "challenge-options-all",
        completed: "challenge-options-completed",
        incomplete: "challenge-options-incomplete option-selected",
      },
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
    let challengeArray = [];
    challengeArray = await challenge.find({
      title: { $in: nonExeptedChallenges },
    });
    res.render("acceptChallenges", {
      locals,
      challengeArray,
      username: req.params.username,
    });
  } catch (error) {
    console.log(error);
  }
});
// Adding a new challege for the user
router.put(
  "/:username/addChallenge/:title",
  authMiddleware,
  async (req, res) => {
    try {
      const thischallenge = await challenge.findOne({
        title: req.params.title,
      });
      let usersData = await userData.findOne({ username: req.params.username });
      usersData = usersData.acceptedChallenges;
      let acceptedTitles = [];
      usersData.forEach((c) => {
        acceptedTitles.push(c.title);
      });
      if (acceptedTitles.includes(req.params.title)) {
        return;
      } else {
        const date = new Date();

        // Set the time to midnight for both today and givenDate
        date.setHours(0, 0, 0, 0);

        // Add 30 days to today's date (ignoring time)
        const futureDate = new Date(date);
        futureDate.setDate(date.getDate() + thischallenge.minDayReq);

        // Also set the time of givenDate to midnight
        futureDate.setHours(0, 0, 0, 0);
        //console.log(date, futureDate);
        const data = {
          title: req.params.title,
          dataAccepted: date,
          minDateToComplete: futureDate,
          compleated: false,
          canComplete: false,
        };
        await userData.findOneAndUpdate(
          { username: req.params.username },
          { $push: { acceptedChallenges: data } }
        );
        await challenge.findOneAndUpdate(
          { title: req.params.title },
          { $inc: { "compleated.accepted": 1 } }
        );
        res.redirect(`/user/${req.params.username}/acceptChallenges`);
      }
    } catch (error) {
      console.log(error);
    }
  }
);

// update challenge to be compleated
router.put("/:username/:title", authMiddleware, async (req, res) => {
  try {
    console.log(req.body);
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
    await challenge.findOneAndUpdate(
      { title: req.params.title },
      { $inc: { "compleated.compleated": 1 } }
    );
    res.redirect(`/user/${req.params.username}`);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
