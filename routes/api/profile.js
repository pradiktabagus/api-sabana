const express = require("express");
const router = express.Router();
const User = require("../../model/user");
const auth = require("../../middleware/auth");

/**
 * @description search profile by username
 * @param username
 */
// Preload user profile on routes with ':username'
router.param("username", function (req, res, next, username) {
  User.findOne({ username: username })
    .then(function (user) {
      if (!user) {
        return res.status(404).json({
          status: 404,
          error: `User ${queryParam} Not Found`,
        });
      }
      req.profile = user;
      return next();
    })
    .catch(next);
});
router.get("/:username", auth, async (req, res) => {
  if (req.user) {
    User.findById(req.user.id).then(function (user) {
      if (!user) {
        return res.json({
          status: 200,
          data: req.profile.toProfileJSONFor(false),
        });
      }
      return res.json({
        status: 200,
        data: req.profile.toProfileJSONFor(user),
      });
    });
  } else {
    return res.status(200).json({
      status: 200,
      data: req.profile.toProfileJSONFor(false),
    });
  }
});

router.post("/:username/follow", auth, function (req, res, next) {
  var profileId = req.profile._id;
  User.findById(req.user.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }

      return user.follow(profileId).then(function () {
        return res.json({
          status: 200,
          data: {
            isFollow: user ? user.isFollowing(user._id) : false,
          },
        });
      });
    })
    .catch(next);
});

router.delete("/:username/follow", auth, function (req, res, next) {
  var profileId = req.profile._id;

  User.findById(req.user.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }

      return user.unfollow(profileId).then(function () {
        return res.json({
          status: 200,
          data: {
            isFollow: user ? user.isFollowing(user._id) : false,
          },
        });
      });
    })
    .catch(next);
});

module.exports = router;
