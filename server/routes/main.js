const express = require("express");
const router = express.Router();
const challenge = require("../models/challenge");

//Home Page
router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "Home Page",
      description: "A Home Page For the user",
    };
    const userChallenges = await challenge.find();

    res.render("UserHome", { locals, userChallenges });
  } catch (error) {
    console.log(error);
  }
});

// // Get Post by Id
// router.get("/post/:id", async (req, res) => {
//   try {
//     let slug = req.params.id;

//     const data = await Post.findById({ _id: slug });

//     const locals = {
//       title: data.title,
//       description:
//         "A blog template application that will be used for your own use.",
//     };
//     res.render("post", { locals, data });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //Search Route
// router.post("/search", async (req, res) => {
//   try {
//     const locals = {
//       title: "Search",
//       description: "A blog template made with NodeJs and ExoressJS",
//     };
//     let searchTerm = req.body.SearchTerm;
//     console.log(searchTerm);
//     const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z ]/g, "");

//     const data = await Post.find({
//       $or: [
//         { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
//         { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
//       ],
//     });
//     res.render("search", { locals, data });
//   } catch (error) {
//     console.log(error, "Here");
//   }
// });

// //About Page
// router.get("/about", async (req, res) => {
//   const locals = {
//     title: "NodeJS About",
//     description:
//       "A blog template application that will be used for your own use.",
//   };

//   try {
//     const data = await Post.find().sort({ createdAt: "desc" });
//     res.render("about", { locals, data });
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = router;
