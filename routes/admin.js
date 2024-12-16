const adminController = require("../controllers/admin");
const routes = require("express").Router();

//GET get all challenges
routes.get("/", adminController.getAllChallenges);

// POST create challenge
routes.post("/create", adminController.createChalenge);

//PUT Update challenge
routes.put("/update/:id", adminController.updateChallenge);

//DELETE Delete challenge
routes.delete("delete/:id", adminController.deleteChallenge);

module.exports = routes;
