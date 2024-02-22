const express = require("express");
const router = express.Router();
const sql = require("mssql");
const dbconfig = require("../../libs/dbconfig");
const createError = require("http-errors");
const { getLotNo, getPlanInfo } = require("../../controllers/hopper.controller");

router.get("/", async (req, res, next) => {
    try {
        const { ProdDate } = req.query
        const pool = await sql.connect(dbconfig);
        let plan = { recordset: [] }

        if (ProdDate) {
            plan = await pool.request().query(`SELECT RecpNameID, RecpName, LotNo, LocationName
            FROM [viewPlanInfo]
            WHERE ProdDate = '${ProdDate}'
            GROUP BY RecpNameID, RecpName, LotNo, LocationName`);
        }

        res.status(200).send(plan.recordset)
    } catch (err) {
        next(err)
    }
});

router.get("/recipes", async (req, res, next) => {
    try {
        const pool = await sql.connect(dbconfig);
        let recipes = await pool.request().query(`SELECT RecpNameID, RecpName
            FROM MasterRecipeName`);
        res.status(200).send(recipes.recordset)
    } catch (err) {
        next(err)
    }
});


router.get("/lot", async (req, res, next) => {
    try {
        const { ProdDate, RecpNameID } = req.query
        let Plan = ''

        if (ProdDate && RecpNameID) {
            Plan = await getPlanInfo(ProdDate, RecpNameID)
        }

        res.status(200).send({ LotNo:Plan?.LotNo||'' })
    } catch (err) {
        next(err)
    }
});

router.get("/user", async (req, res, next) => {
    try {
        const { Username } = req.query
        const pool = await sql.connect(dbconfig);
        let User = await pool.request().query(`SELECT Name,Surname
            FROM MasterUser
            WHERE Username = N'${Username}'`);
        res.status(200).send(User.recordset[0])
    } catch (err) {
        next(err)
    }
});

module.exports = router;
