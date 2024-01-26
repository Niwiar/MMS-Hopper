const express = require("express");
const router = express.Router();
const sql = require("mssql");
const dbconfig = require("../../libs/dbconfig");
const path = require("path");
const XlsxPopulate = require("xlsx-populate");
const { dymDate } = require("../../libs/date");
const { fillDataTemplate, writeFile } = require("../../libs/reportUtil");
const {
  getLogHopperRec,
  getLogHopperDwt,
  getLotNo,
  getLogHopperList,
  getRecpName,
  getLogHopperOp,
} = require("../../controllers/hopper.controller");

router.get("/", async (req, res, next) => {
  try {
    const { ProdDate, RecpNameID } = req.query;
    let logHopper = [];

    if (ProdDate && RecpNameID) {
      logHopper = await getLogHopperRec(ProdDate, RecpNameID);
    }

    res.status(200).send(logHopper);
  } catch (err) {
    next(err);
  }
});

router.get("/list", async (req, res, next) => {
  try {
    const { FromDate, ToDate } = req.query;
    const hopperList = await getLogHopperList(FromDate, ToDate);
    res.status(200).send(hopperList);
  } catch (err) {
    next(err);
  }
});

router.get("/report", async (req, res, next) => {
  try {
    const { ProdDate, RecpNameID } = req.query;
    const LotNo = await getLotNo(ProdDate, RecpNameID);
    const RecpName = await getRecpName(RecpNameID);
    const logHopperRec = await getLogHopperRec(ProdDate, RecpNameID);
    const logHopperDwt = await getLogHopperDwt(ProdDate, RecpNameID);
    const logHopperOp = await getLogHopperOp(ProdDate, RecpNameID);

    let logHopperOpArr = []
    logHopperOp.forEach((item) =>{
      logHopperOpArr.push([
      `กะ1 : ${item.ALead1_1Name||'-'}`,'','',
      `กะ2 : ${item.ALead2Name||'-'}`,'',
      `กะ3 : ${item.ALead3Name||'-'}`,'','',
      `กะ1 : ${item.ALead1_2Name||'-'}`,'',
      `วันที่ : ${item.ALeadDate?dymDate(item.ALeadDate):'-'}`
    ])
    logHopperOpArr.push([
      `กะ1 : ${item.Lead1_1Name||'-'}`,'','',
      `กะ2 : ${item.Lead2Name||'-'}`,'',
      `กะ3 : ${item.Lead3Name||'-'}`,'','',
      `กะ1 : ${item.Lead1_2Name||'-'}`,'',
      `วันที่ : ${item.LeadDate?dymDate(item.LeadDate):'-'}`
    ])});

    let logHopperRecArr = logHopperRec.map((item) => [
      item.ProdDate, item.BatchNo, item.Shift,
      item.StartTime, item.BatchEndTime, item.Duration,
      item.ProdName,
    ]);

    let logHopperDwtArr = logHopperDwt.map((dwt) => [
      `${dwt.Index}. : ตั้งแต่ ${dwt.StartTime || "______________"} ถึง ${
        dwt.EndTime || "______________"
      } รวม ${dwt.Duration || "__________"} นาที`,
      "",
      "",
      "",
      "",
      "",
      `สาเหตุ: ${dwt.Cause && Boolean(dwt.IsOther) ? "อื่นๆ " : ""}${
        dwt.Cause || "_______________________________________"
      }`,
    ]);

    //* excel
    const wb = await XlsxPopulate.fromFileAsync(
      "./public/report/hopper-template.xlsx"
    );
    const ws = wb.sheet(0);
    await fillDataTemplate(ws, logHopperRecArr.slice(0, 28), "A7:G34");
    await fillDataTemplate(ws, logHopperRecArr.slice(28), "H7:N34");
    await fillDataTemplate(ws, logHopperDwtArr, "B36:H40");
    await fillDataTemplate(ws, logHopperOpArr, "C42:M43");
    await ws.row(3).cell(2).value(dymDate(ProdDate));
    await ws.row(3).cell(9).value(RecpName);
    await ws.row(3).cell(13).value(LotNo);

    await writeFile(wb, "HopperReport.xlsx");
    let file = path.join(process.cwd(), "/public/temp/HopperReport.xlsx");
    res.download(file);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const {
      RecpNameID,
      ProdDate,
      BatchNo,
      Shift,
      ProdUser,
      StartTime,
      BatchEndTime,
    } = req.body;
    const pool = await sql.connect(dbconfig);

    await pool.request()
      .query(`INSERT INTO LogHopperRec(ProdDate,RecpNameID,BatchNo,Shift,ProdUser,StartTime,BatchEndTime) 
            VALUES('${ProdDate}',${RecpNameID},'${BatchNo}',${Shift},N'${ProdUser}','${StartTime}','${BatchEndTime}')`);

    res.status(200).send({ messages: "ok" });
  } catch (err) {
    next(err);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const { LogID, StartTime, BatchEndTime } = req.body;
    const pool = await sql.connect(dbconfig);

    await pool.request().query(`UPDATE LogHopperRec
            SET StartTime = '${StartTime}', BatchEndTime = '${BatchEndTime}'
            WHERE LogID = ${LogID}`);

    res.status(200).send({ messages: "ok" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
