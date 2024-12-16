const myController = require("../controllers");
const routes = require("express").Router();

routes.get("/", myController.helloFunction);

module.exports = routes;
