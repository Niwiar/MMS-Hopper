const express = require("express");
const router = express.Router();
const sql = require("mssql");
const dbconfig = require("../libs/dbconfig");
const createHttpError = require("http-errors");
require("dotenv").config();

router.get('/', (req, res, next) => {
  if (!req.session.isLoggedIn) return res.sendStatus(400)
  res.status(200).send({ Name: req.session.Name, Location: req.session.Location })
}
)

router.post("/login", async (req, res, next) => {
  try {
    const { Username, Password, LocID } = req.body;
    console.log(req.body)
    const pool = await sql.connect(dbconfig);
    const login = await pool.request().query(`SELECT *
        FROM [MasterUser]
        WHERE Username = N'${Username}' AND Password = N'${Password}'`);
    console.log(login.recordset)
    if (!login.recordset.length) return next(createHttpError(401, "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"));

    const location = await pool.request().query(`SELECT LocationName
    FROM [MasterLocation] WHERE LocID = ${LocID}`);
    const { UserId, Name, Surname } = login.recordset[0];
    // let auth = await pool.request().query(`SELECT * FROM [MasterPosition]
    //   WHERE PositionId = ${PositionId}`);
    req.session.isLoggedIn = true;
    req.session.UserId = UserId;
    // req.session.Auth = auth.recordset[0];
    res.cookie("Name", `${Name} ${Surname}`, { maxAge: process.env.SESSION_TIME });
    res.cookie("Location", location.recordset[0].LocationName, { maxAge: process.env.SESSION_TIME });
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res, next) => {
  req.session = null;
  res.redirect("/login");
});

module.exports = router;
