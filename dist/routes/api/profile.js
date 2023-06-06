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
router.get("/:username", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
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
    }
    else {
        return res.status(200).json({
            status: 200,
            data: req.profile.toProfileJSONFor(false),
        });
    }
}));
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
