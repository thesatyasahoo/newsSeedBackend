const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const bcrypt = require("bcrypt");
let User = require("../modals/user.model");
const saltRounds = 10;
const multipart = require("connect-multiparty");
const path = require("path");
const multipartMiddleware = multipart({
  uploadDir: "./uploads",
});

router.post("/create", (req, res) => {
  let user = User.find(
    {
      email: req.body.email,
    },
    (err, data) => {
      if (!err) {
        if (data.length > 0) {
          res.send("User already exist");
        } else {
          let salt = bcrypt.genSaltSync(saltRounds);
          let hashPassword = bcrypt.hashSync(req.body.password, salt);

          let newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: hashPassword,
            file: "",
          });
          newUser.save();
          let payload = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            message: "User created Successfully",
            status: 200,
          };
          let token = jwt.sign(payload, "shhhhh");
          let resultValue = {
            message: token,
          };
          return res.status(200).send(resultValue);
        }
      } else {
        return res.status(404).send(err);
      }
    }
  );
});

router.post("/login", (req, res) => {
  let user = User.findOne(
    {
      email: req.body.email,
    },
    (err, data) => {
      if (!err) {
        if (data !== null) {
          if (bcrypt.compareSync(req.body.password, data.password) === true) {
            let payload = {
              id: data._id,
              firstName: data.firstName,
              lastName: data.lastName,
              username: data.username,
              email: data.email,
              message: "User Login Successfully",
              status: 200,
            };
            let token = jwt.sign(payload, "shhhhh");
            let resultValue = {
              message: token,
            };
            res.status(200).send(resultValue);
          } else {
            res.status(404).send("Please check you email and password");
          }
        } else {
          res.status(404).send("Please check you email and password");
        }
      } else {
        res.status(404).send("Please check you email and password");
      }
    }
  );
});

router.get("", async (req, res) => {
  try {
    let users = await User.find();
    if (users && users.length > 0) {
      return res.status(200).send(users);
    } else {
      return res.status(404).send({
        message: "Something Got error!",
      });
    }
  } catch (error) {
    return res.status(404).send({
      message: "Something Got error!",
    });
  }
});

router.get("/download/dp/:id", async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.params.id });
    if (user.file !== "") {
      let file = await path.join(__dirname, "../uploads/" + user.file);
      fs.exists(file, async (exists) => {
        if (exists) {
          const { size } = fs.statSync(file);

          res.writeHead(200, {
            "Content-Type": "image/png",
            "Content-Length": size,
            "Content-Disposition": `attachment; filename='${user.file}`,
          });

          fs.createReadStream(file).pipe(res);
        } else {
          return res.status(400).send({ message:"Error: Image does not exists", status: 400});
        }
      });
      // return res.sendFile(file);
    }
  } catch (error) {
    return res.status(400).send({ message:"Something got Error", status: 400});
  }
});

router.get("/:id", (req, res) => {
  let user = User.findOne(
    {
      _id: req.params.id,
    },
    (err, data) => {
      if (!err) {
        if (data !== null) {
          res.status(200).send(data);
        } else {
          res.status(404).send({
            message: "Data not found by given id, please try with another id",
            status: 404,
          });
        }
      } else {
        res.send(err);
      }
    }
  );
});

router.put("/update/:id", (req, res) => {
  User.findOne(
    {
      _id: req.params.id,
    },
    (err, data) => {
      if (!err) {
        let salt = bcrypt.genSaltSync(saltRounds);
        let hashPassword = bcrypt.hashSync(req.body.password, salt);

        User.updateOne(
          {
            _id: req.params.id,
          },
          {
            $set: {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              username: req.body.username,
              email: req.body.email,
              password: hashPassword,
              file: req.body.file,
            },
          },
          (error, result) => {
            if (!error) {
              if (result.nModified === 1) {
                return res
                  .status(200)
                  .send({ message: "User Updated Successfully", status: 200 });
              } else {
                return res.status(400).send({
                  message: "Please try to give new Value",
                  status: 400,
                });
              }
            } else {
              return res
                .status(400)
                .send({ message: "Already have account", status: 400 });
            }
          }
        );
      } else {
        return res
          .status(404)
          .send({ message: "User not exist.", status: 400 });
      }
    }
  );
});

router.delete("/remove/:id", async (req, res) => {
  let user = await User.findOne({
    _id: req.params.id,
  });

  if (user) {
    User.deleteOne(
      {
        _id: req.params.id,
      },
      (err, data) => {
        if (!err) {
          if (data.deletedCount === 1) {
            res.send({
              status: 200,
              message: "Deleted Successfully",
            });
          }
        } else {
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

router.post("/forgot-Password", (req, res) => {
  return sendEmailForGotPassword("Forgot password", req.body.email)
    .then((result) => {
      res.send({
        message: "Mail sent successfully",
        status: 200,
      });
    })
    .catch((error) => {
      res.send({
        message: "Error in mail sent, please check logs",
        status: 404,
      });
    });
});

router.put("/update-password", (req, res) => {
  User.findOne(
    {
      email: req.body.email,
    },
    (err, data) => {
      if (!err) {
        if (bcrypt.compareSync(req.body.password, data.password) !== true) {
          let salt = bcrypt.genSaltSync(saltRounds);
          let hashPassword = bcrypt.hashSync(req.body.password, salt);
          let newData = {
            ...data,
            password: hashPassword,
          };
          User.updateOne(
            {
              _id: data.id,
            },
            {
              $set: newData,
            },
            (error, result) => {
              if (!error) {
                if (result.nModified === 1) {
                  res.send(`Password Updated Successfully`);
                  sendEmailUpdatePassword("Updated Password", req.body.email);
                } else {
                  res.send(`Please try to give new Password`);
                }
              } else {
                res.send(`Already have account`);
              }
            }
          );
          res.status(200).send(`User Updated`);
        } else {
          res.status(404).send("Please try with deferent password");
        }
      } else {
        res.status(404).send("User not exist.");
      }
    }
  );
});
router.post("/api/upload", multipartMiddleware, async (req, res) => {
  await User.updateOne(
    {
      email: req.headers.authorization,
    },
    {
      $set: {
        file: req.files.uploads[0].path.replace("uploads\\", ""),
      },
    },
    (error, result) => {
      if (!error) {
        return res.json({
          message: "File uploaded succesfully.",
          path: req.files.uploads[0].path.replace("uploads\\", ""),
        });
      } else {
        return res.send(`Already have account`);
      }
    }
  );
});

module.exports = router;
