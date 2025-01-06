const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const challenges = require("../models/challenge");
const userInfo = require("../models/UserInfo");
const adminUser = require("../models/AdminUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { trusted } = require("mongoose");
const challenge = require("../models/challenge");
const jwtSecret = process.env.JWT_SECRET;
const adminLayout = "../views/layouts/admin.ejs";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    let match = false;
    const adminUsers = await adminUser.find();
    adminUsers.forEach((user) => {
      const passwordsMatch = token.password === user.password;
      if (passwordsMatch) {
        match = true;
      }
    });
    if (match) {
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

/**
 * Get /dashboard
 * Admin - Dashboard
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "dashboard",
      description: "A blog template made with NodeJS and ExpressJS",
    };
    const data = await challenges.find();
    res.render("admin/dashboard", { locals, data, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});
/**
 * POST /register
 * Admin - Register Account
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await adminUser.create({
        username: username,
        password: hashedPassword,
      });
      res.status(200).json({ message: "User created successfully", user });
    } catch (error) {
      console.log(error.status);
      if (error == 11000) {
        return req.status(500).json({ message: "User already Exists!" });
      } else {
        return res
          .status(500)
          .json({ message: "Something went wrong with the server! " });
      }
    }
  } catch {
    console.log(error);
  }
});

/**
 * Get /logout
 * Admin - Logout
 */
router.get("/logout", authMiddleware, async (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /add-post
 * Admin - Create New Post
 */
router.get("/add-challenge", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Create Challenge",
      description: "Admin page to add a challenge",
    };
    const data = await challenges.find();
    res.render("admin/add-challenge", { locals, data, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /add-post
 * Admin - Create New Post
 */
router.post("/add-challenge/", authMiddleware, async (req, res) => {
  try {
    console.log(req.body);
    let released;
    if (req.body.released == "on") {
      released = true;
    } else {
      released = false;
    }
    const newChallenge = {
      title: req.body.title,
      desc: req.body.desc,
      category: req.body.category,
      released: released,
    };
    await challenges.create(newChallenge);
    res.redirect("/admin/");
  } catch (error) {
    console.log(error);
  }
});

/**
 * Get /edit-post
 * Admin - Update Post
 */
router.get("/edit-challenge/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "A blog template made with NodeJS and ExpressJS",
    };
    const data = await challenges.findOne({ _id: req.params.id });
    res.render("admin/edit-challenge", { locals, data, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

/**
 * PUT /edit-challenge
 * Admin -Edit challenge
 */
router.put("/edit-challenge/:id", authMiddleware, async (req, res) => {
  let released;
  console.log(req.body);
  if (req.body.released === "on") {
    released = true;
  } else {
    released = false;
  }
  let data = req.body;
  data.released = released;
  try {
    await challenges.findByIdAndUpdate(req.params.id, data);
    res.redirect("/admin/");
  } catch (error) {
    console.log(error);
  }
});

/**
 * DELETE /delete-challenge
 * Admin - Delete challenge
 */
router.delete("/delete-challenge/:id", authMiddleware, async (req, res) => {
  try {
    await challenges.deleteOne({ _id: req.params.id });
    // const allUserInfo = await userInfo.find();
    // allUserInfo.forEach((user) => {
    //   userInfo.findOneAndUpdate(
    //     { username: user.username }, // filter by username or _id
    //     { $pull: { acceptedChallenges: { title: req.body.title } } } // remove the challenge with title "Challenge two"
    //   );
    // });
  } catch (error) {
    console.log(error);
  }
  const allUserInfo = await userInfo.find();

  for (const user of allUserInfo) {
    try {
      await userInfo.findOneAndUpdate(
        { username: user.username }, // filter by username
        { $pull: { acceptedChallenges: { title: req.body.title } } }, // remove challenge by title
        { new: true } // optional: return the updated document
      );
    } catch (error) {
      console.error("Error updating user:", user.username, error);
    }
  }
  res.redirect("/admin");
});

module.exports = router;
