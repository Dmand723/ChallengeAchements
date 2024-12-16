const express = require("express");
const cors = require("cors");
const mongodb = require("./db/connect");

const app = express();
const PORT = process.env.PORT || 3000;
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app
  .use(cors())
  .use(express.json())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  })
  .use("/", require("./routes"));
mongodb.initDB((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(PORT);
    console.log("\x1b[35m", `Connected to DB and listening on ${PORT}`);
  }
});
