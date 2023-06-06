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
const { check, validationResult } = require("express-validator");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../model/user");
/**
 * @method - POST
 * @param - /auth/signup
 * @description - User SignUp
 */
router.post("/signup", [
    check("username", "Username cannot be empty").not().isEmpty(),
    check("email", "Email cannot be empty").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Minimum 6 Character for your password").isLength({
        min: 6,
    }),
    check("password", "Password cannot be empty").not().isEmpty(),
], (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
        const EmailIsAlready = yield User.findOne({
            email,
        });
        const UsernameIsAlready = yield User.findOne({
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
            return res.status(409).json({
                status: 409,
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
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Server Error",
        });
    }
}));
/**
 * @method - GET
 * @description - Get LoggedIn User
 * @param - /auth/login
 */
router.post("/signin", [
    check("username", "Email cannot be blank").not().isEmpty(),
    check("password", "password cannot be blank").not().isEmpty(),
    check("password", "Please enter valid password").isLength({
        min: 6,
    }),
], (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
    try {
        const { password, username } = req.body;
        const user = yield User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                status: 400,
                error: `User ${username} Not Found`,
            });
        }
        if (!user || !user.validPassword(password)) {
            return res.status(400).json({
                status: 400,
                error: `Password is Invalid`,
            });
        }
        return res.json({
            status: 200,
            data: user.toAuthJSON(),
        });
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal Server Error",
        });
    }
}));
/**
 * @method - GET
 * @description - Get LoggedIn User
 * @param - /auth/me
 */
router.get("/me", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        // request.user is getting fetched from Middleware after token authentication
        const user = yield User.findById(req.user.id);
        res.status(200).json({
            status: 200,
            data: user.toProfileJSONFor(),
        });
    }
    catch (e) {
        res.send({ message: "Error in Fetching user" });
    }
}));
module.exports = router;
