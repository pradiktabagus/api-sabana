var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Article = require("../../model/article");
const User = require("../../model/user");
router.post("/", auth, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const user = yield User.findById(req.user.id);
        var Articles = new Article(req.body);
        Articles.author = user;
        return Articles.save().then(function () {
            return res.json({ status: 200, data: Articles.toJsonFor(user) });
        });
    }
    catch (error) {
        res.send({ message: "Error in Fetching user" });
    }
}));
router.get("/feeds", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
    }
    catch (error) {
        res.send({ message: "Error in Fetching user" });
    }
}));
module.exports = router;
