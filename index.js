const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db/db");
let userController = require("./controller/users.controller");
let newsController = require("./controller/news.controller");
let app = express();

app.use(bodyParser.json());
app.use(cors({ origin: true }));
app.use(express.static(__dirname + '/uploads'));

const port = process.env.PORT || 3000;

app.get("", (req, res) => {
  return res.send("Welcome to test server.");
});

app.listen(port, () => {
  console.log(`Server listen at port no : ${port}`);
});

app.use("/user", userController);
app.use("/news", newsController);
