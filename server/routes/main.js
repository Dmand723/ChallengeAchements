const express = require("express");
const router = express.Router();
const challenge = require("../models/challenge");
const User = require("../models/User");
const userData = require("../models/UserInfo");
const bcrypt = require("bcrypt");

//Home Page
router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "Home Page",
      description: "A Home Page For the user",
    };
    const userChallenges = await challenge.find();

    res.render("index");
  } catch (error) {
    console.log(error);
  }
});

router.get("/login", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.render("login");
  } else {
    res.redirect(`/user/${token.username}`);
  }
});

router.get("/register", async (req, res) => {
  res.render("signUp");
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({
        username: username,
        password: hashedPassword,
      });
      const usersData = await userData.create({
        username: username,
        acceptedChallenges: [],
      });
      res.status(200).json({ message: "User created successfully", user });
    } catch (error) {
      console.log(error);
      if (error == 11000) {
        return req.status(500).json({ message: "User already Exists!" });
      } else {
        return res
          .status(500)
          .json({ message: "Something went wrong with the server! " });
      }
    }
  } catch (error) {
    console.log(error);
  }
});
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (passwordsMatch) {
      const token = user;
      res.cookie(`token`, token, { httpOnly: true });
      res.redirect(`/user/${username}`);
    }
    if (!user || !passwordsMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
  }
});
router.get("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
