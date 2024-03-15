const express = require("express");
const router = express.Router();

const { ifLoggedIn, ifNotLoggedIn, isAuth } = require("../middleware/checkUser");


router.get("/", ifNotLoggedIn, (req, res) => {
    res.render("index");
});
router.get("/hopper-record", ifNotLoggedIn, (req, res) => {
    res.render("HopperRecord");
});

router.get("/login", (req, res) => {
    res.render("login");
});

module.exports = router;
