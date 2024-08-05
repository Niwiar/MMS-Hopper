const express = require("express");
const router = express.Router();

const {
  ifLoggedIn,
  ifNotLoggedIn,
  isAuth,
} = require("../middleware/checkUser");

router.get("/", ifNotLoggedIn, (req, res) => {
  res.render("index");
});
router.get("/hopper-record", ifNotLoggedIn, (req, res) => {
  res.render("HopperRecord");
});
router.get("/hopper-history", ifNotLoggedIn, (req, res) => {
  res.render("HopperHistory");
});
router.get("/feedrate-record", ifNotLoggedIn, (req, res) => {
  res.render("FeedrateRecord");
});
// router.get("/feedrate-history", ifNotLoggedIn, (req, res) => {
//   res.render("HopperHistory");
// });

router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
