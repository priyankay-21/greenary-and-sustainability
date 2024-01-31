//@ts-check
const express = require("express");
const router = express.Router();
var User = require("../models/user.model");

router.route("/login/getUser").get((req, res) => {
  User.find()
    .then((e) => res.json(e))
    .catch((err) => res.status(400).json("notfound"));
});

router.route("/signup/createUser").post((req, res) => {
  const phone = req.body.phone;
  const user_type = req.body.user_type;
  const valid_signup = req.body.valid_signup;
  const user = new User({ phone, user_type, valid_signup });
  user
    .save()
    .then(() => res.json("Added new user!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:phone").post((req, res) => {
  //console.log(req)
  //console.log("req.body", req.body)
  User.find({ phone: req.body.phone })
    .then((users) => {
      //console.log("User", users)
      //console.log(users.length)
      if (users.length == 0) {
        console.log("user not found");
        return;
      }
      let user = users[0];
      user.valid_signup = req.body.valid_signup;
      console.log(req.body.valid_signup);
      //console.log("User", user)
      user
        .save()
        .then(() => res.json("Sign up status updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/newphone/:id").post((req, res) => {
  User.find({ phone: req.params.id })
    .then((users) => {
      if (users.length == 0) {
        console.log("user not found");
        return;
      }
      let user = users[0];
      user.is_banned = req.body.is_banned;
      user
        .save()
        .then(() => res.json("Ban status updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
