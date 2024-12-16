const myController = require("../controllers");

const routes = require("express").Router();

//routes.get("/", myController.helloFunction);
routes.get("/", async (req, res) => {
  const locals = {
    title: "Home Page",
    description: "Home Page",
  };
  res.render("index", { locals });
});

routes.use("/admin", require("./admin"));

module.exports = routes;
