const express = require("express");
const router = express.Router();
const sql = require("mssql");
const dbconfig = require("../libs/dbconfig");
const createHttpError = require("http-errors");
require("dotenv").config();

router.get("/", (req, res, next) => {
  if (!req.session.isLoggedIn) return res.sendStatus(400);
  res
    .status(200)
    .send({ Name: req.session.Name, Location: req.session.Location });
});

router.post("/login", async (req, res, next) => {
  try {
    const { Username, Password, LocID } = req.body;
    const pool = await sql.connect(dbconfig);
    const login = await pool.request().query(`SELECT *
        FROM [MasterUser]
        WHERE Username = N'${Username}' AND Password = N'${Password}'`);
    if (!login.recordset.length)
      return next(createHttpError(401, "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"));

    const { UserId, Name } = login.recordset[0];
    // let auth = await pool.request().query(`SELECT * FROM [MasterPosition]
    //   WHERE PositionId = ${PositionId}`);
    req.session.isLoggedIn = true;
    req.session.UserId = UserId;
    // req.session.Auth = auth.recordset[0];
    res.cookie("Name", Name, {
      maxAge: process.env.SESSION_TIME,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
    if (LocID) {
      const location = await pool.request().query(`SELECT LocationName
        FROM [MasterLocation] WHERE LocID = ${LocID}`);
      res.cookie("Location", location.recordset[0].LocationName, {
        maxAge: process.env.SESSION_TIME,
        httpOnly: true,
      });
    }

    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res, next) => {
  req.session = null;
  res.clearCookie("Name");
  res.clearCookie("Location");
  res.redirect("/login");
});

module.exports = router;
