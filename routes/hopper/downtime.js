const express = require("express");
const router = express.Router();
const sql = require("mssql");
const dbconfig = require("../../libs/dbconfig");
const { getLogHopperDwt } = require("../../controllers/hopper.controller");
const { diffMin, addDate } = require("../../libs/date");

const problemObject = (length, init) =>
  Array.from({ length }, (_, i) => ({
    Index: i + init + 1,
    StartTime: "",
    EndTime: "",
    Duration: null,
    Cause: null,
  }));

router.get("/", async (req, res, next) => {
  try {
    const { ProdDate, RecpNameID } = req.query;
    let logHopperDwt = [];
    let Length = 5;
    if (ProdDate && RecpNameID) {
      logHopperDwt = await getLogHopperDwt(ProdDate, RecpNameID);
      if (Length && logHopperDwt.length < Length)
        logHopperDwt = [
          ...logHopperDwt,
          ...problemObject(Length - logHopperDwt.length, logHopperDwt.length),
        ];
    }
    res.status(200).send(logHopperDwt);
  } catch (err) {
    next(err);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const { ProdDate, RecpNameID } = req.query;
    const { Downtimes } = req.body;
    const pool = await sql.connect(dbconfig);

    for (const dwt of Downtimes) {
      const { LogID, StartTime, EndTime, IsOther, Cause } = dwt;
      let StartDatetime = StartTime ? `${ProdDate} ${StartTime}` : null;
      let EndDatetime = EndTime ? `${ProdDate} ${EndTime}` : null;
      if (
        StartDatetime &&
        EndDatetime &&
        diffMin(
          StartDatetime.replaceAll("'", ""),
          EndDatetime.replaceAll("'", "")
        ) < 0
      )
        EndDatetime = `'${addDate(ProdDate, 1)} ${EndTime}'`;
      let CreatedTime = StartDatetime;
      console.log(StartDatetime, EndDatetime, CreatedTime, Cause);

      let prepare = pool
        .request()
        .input("StartTime", sql.DateTimeOffset, StartDatetime)
        .input("EndTime", sql.DateTimeOffset, EndDatetime)
        .input("CreatedTime", sql.DateTimeOffset, CreatedTime)
        .input("IsOther", sql.Bit, IsOther)
        .input("Cause", sql.NVarChar, Cause);

      if (LogID) {
        if (Cause) {
          // Edit Problem
          console.log("Edit Problem");
          await prepare.query(`UPDATE LogProblem
              SET CreatedTime = @CreatedTime, StartTime = @StartTime, EndTime = @EndTime, 
                IsOther = @IsOther, Cause = @Cause
              WHERE LogProblemID = ${LogID}`);
        } else {
          // Delete Problem
          await pool
            .request()
            .query(`DELETE FROM LogProblem WHERE LogProblemID = ${LogID}`);
        }
      } else {
        // New Problem
        if (!Cause) continue;
        console.log("New Problem");
        await prepare.query(`INSERT INTO LogProblem
            (ProdDate,RecpNameID,SectionID,Type,
              CreatedTime,StartTime,EndTime,IsOther,Cause)
            VALUES('${ProdDate}',${RecpNameID},7,1,
              @CreatedTime, @StartTime, @EndTime, @IsOther, @Cause);
            SELECT SCOPE_IDENTITY() AS id;`);
      }
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
