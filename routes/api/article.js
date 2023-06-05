const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Article = require("../../model/article");
const User = require("../../model/user");

router.post("/", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    var Articles = new Article(req.body);
    Articles.author = user;
    return Articles.save().then(function () {
      return res.json({ status: 200, data: Articles.toJsonFor(user) });
    });
  } catch (error) {
    res.send({ message: "Error in Fetching user" });
  }
});

router.get("/feeds", async (req, res, next) => {
  try {
    let limit = 20;
    let offset = 0;
    if (typeof req.query.limit !== "undefined") {
      limit = req.query.limit;
    }

    if (typeof req.query.offset !== "undefined") {
      offset = req.query.offset;
    }
    Promise.all([
      Article.find().limit(Number(limit)).skip(Number(offset)),
      Article.count(),
    ])
      .then(function (result) {
        let articles = result[0];
        let totalcount = result[1];
        return res.json({
          status: 200,
          data: articles,
          meta: {
            offset: Number(offset),
            limit: articles.length,
            total: totalcount,
          },
        });
      })
      .catch(next);
  } catch (error) {
    res.send({ message: "Error in Fetching user" });
  }
});
module.exports = router;
