const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let User = require("../modals/user.model");
let News = require("../modals/news.model");
const fetch = require("node-fetch");
const saltRounds = 10;

router.post("/create", async (req, res) => {
  try {
    let news = await News.find({
      author: req.body.author,
      user: req.headers.authorization
    });

    if (news && news.length > 0) {
      return res
        .status(400)
        .send({ message: "News Feed Already Added.", status: 400 });
    } else {
      await News.create({
      isAdded: true,
      user: req.headers.authorization,
      ...req.body,
      });
      return res.status(200).send({ message: "News Feed Added Successfully.", status: 200 })
    }
  } catch (error) {
    return res.status(400).send({ message: "Something Error.", status: 400 });
  }
});

router.post("/addBookmark", async (req, res) => {
  try {
    let news = await News.find({
      author: req.body.author,
      user: req.headers.authorization
    });

    if (news && news.length > 0) {
      return res
        .status(400)
        .send({ message: "Bookmark Already Added.", status: 400 });
    } else {
      await News.create({
      isAdded: true,
      ...req.body,
      });
      return res.status(200).send({ message: "Bookmark Added Successfully.", status: 200 })
    }
  } catch (error) {
    return res.status(400).send({ message: "Something Error.", status: 400 });
  }
});

router.get("", async (req, res) => {
  await News.find((error, result) => {
    if (!error) {
      if(result && result.length > 0) {
        let response = result.filter((e) => e.user == req.headers.authorization);
        return res.status(200).send({
          message: "ok",
          status: 200,
          data: response,
          totalData: response.length
        })
      }
    } else {
      return res.status(404).send(error);
    }
  });
});

router.get("/webApi", async (req, res) => {
  try {
    let fetchApi = await fetch('https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=a5813d56377844fa9514e3ad80fee1fa');
    const data = await fetchApi.json();
    return res.status(200).send(data)
  } catch (error) {
    return res.status(404).send(error);
  }
});

router.delete("/remove/:id", async (req, res) => {
  // console.log(req.params.id);
  let user = await News.findOne({
    _id: req.params.id,
  });

  if (user) {
    News.deleteOne(
      {
        _id: req.params.id,
      },
      (err, data) => {
        if (!err) {
          // console.log(res, "res");
          if (data.deletedCount === 1) {
            res.send({
              status: 200,
              message: "Deleted Successfully",
            });
          }
        } else {
          // console.log(err, "err");
          res.send("Please contact your adminstrator");
        }
      }
    );
  } else {
    res.status(404).send({
      status: 404,
      message: "data Not found",
    });
  }
});

module.exports = router;
