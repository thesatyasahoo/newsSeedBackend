const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db/db");
let userController = require("./controller/users.controller");
let newsController = require("./controller/news.controller");
let app = express();

app.use(bodyParser.json());

app.get("", (req, res) => {
  res.send(`Welcome to test server.`);
});

app.use(cors({ origin: true }));
let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listen at port no : ${port}`);
});

app.use("/user", userController);
app.use("/news", newsController);
