const express = require("express");
const router = express.Router();
const sql = require("mssql");
const dbconfig = require("../../libs/dbconfig");
const createError = require("http-errors");
const { getLotNo } = require("../../controllers/hopper.controller");

router.get("/recipes-by-date", async (req, res, next) => {
    try {
        const { ProdDate } = req.query
        const pool = await sql.connect(dbconfig);
        let recipes = { recordset: [] }

        if (ProdDate) {
            recipes = await pool.request().query(`SELECT pl.RecpNameID, mrn.RecpName,
                (SELECT TOP 1 logpl.CurrentLot
                    FROM LogProdPlan logpl
                    WHERE logpl.RecpNameID = pl.RecpNameID
                        AND logpl.ProdDate = pl.ProdDate) CurrentLot
            FROM [Plan] pl
            LEFT JOIN MasterRecipeName mrn on pl.RecpNameID = mrn.RecpNameID
            WHERE pl.ProdDate = '${ProdDate}'`);
        }

        res.status(200).send(recipes.recordset)
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
        let LotNo = ''

        if (ProdDate && RecpNameID) {
            LotNo = await getLotNo(ProdDate, RecpNameID)
        }

        res.status(200).send({ LotNo })
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
