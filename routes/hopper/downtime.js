const express = require("express");
const router = express.Router();
const sql = require("mssql");
const dbconfig = require("../../libs/dbconfig");
const createError = require("http-errors");
const { getLogHopperDwt } = require("../../controllers/hopper.controller");

router.get("/", async (req, res, next) => {
  try {
    const { ProdDate, RecpNameID } = req.query;
    const pool = await sql.connect(dbconfig);
    let logHopperDwt = [];

    if (ProdDate && RecpNameID) {
      logHopperDwt = await getLogHopperDwt(ProdDate, RecpNameID);
      if (logHopperDwt.length == 0) {
        await pool.request()
          .query(`INSERT INTO LogHopperDwt(ProdDate,RecpNameID) 
                    VALUES('${ProdDate}',${RecpNameID}),
                    ('${ProdDate}',${RecpNameID}), ('${ProdDate}',${RecpNameID}),
                    ('${ProdDate}',${RecpNameID}), ('${ProdDate}',${RecpNameID})`);
        logHopperDwt = await getLogHopperDwt(ProdDate, RecpNameID);
      }
    }
    res.status(200).send(logHopperDwt);
  } catch (err) {
    next(err);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const { ProdDate } = req.query;
    const { Downtimes } = req.body;
    const pool = await sql.connect(dbconfig);

    for (const dwt of Downtimes) {
      const { LogID, StartTime, EndTime, IsOther, Cause } = dwt;
      const StartDatetime = StartTime ? `'${ProdDate} ${StartTime}'` : null;
      const EndDatetime = EndTime ? `'${ProdDate} ${EndTime}'` : null;
      await pool.request().query(`UPDATE LogHopperDwt
        SET StartTime = ${StartDatetime}, EndTime = ${EndDatetime},
            IsOther = ${IsOther}, Cause = ${Cause ? `N'${Cause}'` : null}
        WHERE LogID = ${LogID}`);
    }

    res.status(200).send({ messages: "ok" });
  } catch (err) {
    next(err);
  }
});

// router.put("/", async (req, res, next) => {
//     try {
//         const { LogID, ProdDate, StartTime, EndTime, IsOther, Cause } = req.body
//         const pool = await sql.connect(dbconfig);

//         await pool.request().query(`UPDATE LogHopperRec
//             SET StartTime = '${ProdDate} ${StartTime}', EndTime = '${ProdDate} ${EndTime}',
//                 IsOther = ${IsOther}, Cause = N'${Cause}'
//             WHERE LogID = ${LogID}`);

//         res.status(200).send({ messages: 'ok' })
//     } catch (err) {
//         next(err)
//     }

// });

module.exports = router;
