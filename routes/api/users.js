const mongoose = require("mongoose");
const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../model/user");

/**
 * @method - POST
 * @param - /auth/signup
 * @description - User SignUp
 */

router.post(
  "/signup",
  [
    check("username", "Username cannot be empty").not().isEmpty(),
    check("email", "Email cannot be empty").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Minimum 6 Character for your password").isLength({
      min: 6,
    }),
    check("password", "Password cannot be empty").not().isEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        error: errors.array().map((err) => ({
          param: err.param,
          value: err.value,
          message: err.msg,
        })),
      });
    }

    const { username, email, password } = req.body;
    try {
      const user = new User();
      const validateExist = [];
      const EmailIsAlready = await User.findOne({
        email,
      });
      const UsernameIsAlready = await User.findOne({
        username,
      });

      if (EmailIsAlready) {
        validateExist.push({
          param: "Email",
          value: email,
          message: `${email} is already exist`,
        });
      }

      if (UsernameIsAlready) {
        validateExist.push({
          param: "Username",
          value: username,
          message: `${username} is already exist`,
        });
      }

      if (validateExist.length > 0) {
        return res.status(400).json({
          status: 400,
          error: validateExist,
        });
      }

      user.username = username;
      user.email = email;
      user.setPassword(password);

      user
        .save()
        .then(function () {
          return res.json({
            status: 200,
            data: user.toAuthJSON(),
          });
        })
        .catch(next);
    } catch (err) {
      res.status(500).json({
        status: 500,
        error: "Internal Server Error",
      });
    }
  }
);

/**
 * @method - GET
 * @description - Get LoggedIn User
 * @param - /auth/login
 */

router.post(
  "/login",
  [
    check("email", "Please enter valid email").isEmail(),
    check("email", "Email cannot be blank").not().isEmpty(),
    check("password", "password cannot be blank").not().isEmpty(),
    check("password", "Please enter valid password").isLength({
      min: 6,
    }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        error: errors.array().map((err) => ({
          param: err.param,
          value: err.value,
          message: err.msg,
        })),
      });
    }

    const { email, password } = req.body;
    try {
      passport.authenticate(
        "local",
        { session: false },
        function (err, user, info) {
          if (err) {
            return next(err);
          }
          if (user) {
            user.token = user.generateJWT();
            return res.json({
              user: user.toAuthJSON(),
            });
          } else {
            return res.status(422).json(info);
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: "Internal Server Error",
      });
    }
  }
);

/**
 * @method - GET
 * @description - Get LoggedIn User
 * @param - /auth/me
 */

router.get("/me", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    res.json({
      username: user.username,
      email: user.email,
    });
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

module.exports = router;
