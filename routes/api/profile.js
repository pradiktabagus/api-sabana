const express = require("express");
const router = express.Router();
const User = require("../../model/user");
const auth = require("../../middleware/auth");

router.get("/", auth, async (req, res, next) => {
  let queryParam = req.query.username;
  User.findOne({ username: queryParam }).then(function (user) {
    if (!user)
      return res.status(404).json({
        status: 404,
        error: `User ${queryParam} Not Found`,
      });
    return res.status(200).json({
      status: 200,
      data: user.toProfileJSONFor(),
    });
  });
});

module.exports = router;
