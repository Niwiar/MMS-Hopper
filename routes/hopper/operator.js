const express = require("express");
const router = express.Router();
const sql = require("mssql");
const dbconfig = require("../../libs/dbconfig");
const createError = require("http-errors");
const { getLogHopperOp } = require("../../controllers/hopper.controller");

router.get("/", async (req, res, next) => {
  try {
    const { ProdDate,RecpNameID } = req.query;
    const pool = await sql.connect(dbconfig);
    let operator = [];

    if (ProdDate && RecpNameID) {
      operator =await getLogHopperOp(ProdDate, RecpNameID);
        if(operator.length==0){
            await pool.request()
                .query(`INSERT INTO LogHopperOp(ProdDate,RecpNameID) 
                    VALUES('${ProdDate}',${RecpNameID})`);
            operator =await getLogHopperOp(ProdDate, RecpNameID);
        }
    }

    res.status(200).send(operator[0]);
  } catch (err) {
    next(err);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const { LogID, Lead1_1, ALead1_1, Lead2, ALead2, Lead3, ALead3,
        Lead1_2, ALead1_2, LeadDate, ALeadDate } = req.body;
    const pool = await sql.connect(dbconfig);
    const LeadDateText = LeadDate?`'${LeadDate}'`:null
    const ALeadDateText = ALeadDate?`'${ALeadDate}'`:null

    await pool.request().query(`UPDATE LogHopperOp
        SET Lead1_1 = N'${Lead1_1}', ALead1_1 = N'${ALead1_1}',
            Lead2 = N'${Lead2}', ALead2 = N'${ALead2}',
            Lead3 = N'${Lead3}', ALead3 = N'${ALead3}',
            Lead1_2 = N'${Lead1_2}', ALead1_2 = N'${ALead1_2}',
            LeadDate = ${LeadDateText}, ALeadDate = ${ALeadDateText}
        WHERE LogID = ${LogID}`);
    

    res.status(200).send({messages:'ok'});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
