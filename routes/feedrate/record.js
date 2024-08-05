const express = require("express");
const router = express.Router();
const sql = require("mssql");
const dbconfig = require("../../libs/dbconfig");
const path = require("path");
const XlsxPopulate = require("xlsx-populate");
const { dymDate, diffMin, addDate } = require("../../libs/date");
const { fillDataTemplate, writeFile } = require("../../libs/reportUtil");
const {
  getLogFeedrateRec,
  getLogFeedrateDwt,
  getLogFeedrateList,
  getLogFeedrateOp,
  getPlanInfo,
} = require("../../controllers/feedrate.controller");
const createHttpError = require("http-errors");
const { checkDup } = require("../../libs/sqlUtils");

router.get("/", async (req, res, next) => {
  try {
    const { ProdDate, RecpNameID } = req.query;
    let logFeedrate = [];

    if (ProdDate && RecpNameID) {
      logFeedrate = await getLogFeedrateRec(ProdDate, RecpNameID);
    }

    res.status(200).send(logFeedrate);
  } catch (err) {
    next(err);
  }
});

router.get("/list", async (req, res, next) => {
  try {
    const { FromDate, ToDate } = req.query;
    const hopperList = await getLogFeedrateList(FromDate, ToDate);
    res.status(200).send(hopperList);
  } catch (err) {
    next(err);
  }
});

// router.get("/report", async (req, res, next) => {
//   try {
//     const { ProdDate, RecpNameID } = req.query;
//     const plan = await getPlanInfo(ProdDate, RecpNameID);
//     if (!plan) return next(createHttpError(404, "ไม่มีข้อมูลแผน"));
//     const { LotNo, RecpName } = plan;
//     const logFeedrateRec = await getLogFeedrateRec(ProdDate, RecpNameID);
//     const logFeedrateDwt = await getLogFeedrateDwt(ProdDate, RecpNameID);
//     const logFeedrateOp = await getLogFeedrateOp(ProdDate, RecpNameID);

//     if (logFeedrateRec.length == 0)
//       return next(createHttpError(404, "ไม่มีข้อมูลการบันทึก"));

//     let logFeedrateOpArr = [];
//     logFeedrateOp.forEach((item) => {
//       logFeedrateOpArr.push([
//         `กะ1 : ${item.ALead1_1Name || "-"}`,
//         "",
//         "",
//         `กะ2 : ${item.ALead2Name || "-"}`,
//         "",
//         `กะ3 : ${item.ALead3Name || "-"}`,
//         "",
//         "",
//         `กะ1 : ${item.ALead1_2Name || "-"}`,
//         "",
//         `วันที่ : ${item.ALeadDate ? dymDate(item.ALeadDate) : "-"}`,
//       ]);
//       logFeedrateOpArr.push([
//         `กะ1 : ${item.Lead1_1Name || "-"}`,
//         "",
//         "",
//         `กะ2 : ${item.Lead2Name || "-"}`,
//         "",
//         `กะ3 : ${item.Lead3Name || "-"}`,
//         "",
//         "",
//         `กะ1 : ${item.Lead1_2Name || "-"}`,
//         "",
//         `วันที่ : ${item.LeadDate ? dymDate(item.LeadDate) : "-"}`,
//       ]);
//     });

//     let logFeedrateRecArr = logFeedrateRec.map((item) => [
//       item.ProdDate,
//       item.BatchNo,
//       item.Shift,
//       item.StartTime,
//       item.BatchEndTime,
//       item.Duration,
//       item.ProdName,
//     ]);

//     let logFeedrateDwtArr = logFeedrateDwt.map((dwt) => [
//       `${dwt.Index}. : ตั้งแต่ ${dwt.StartTime || "______________"} ถึง ${
//         dwt.EndTime || "______________"
//       } รวม ${dwt.Duration || "__________"} นาที`,
//       "",
//       "",
//       "",
//       "",
//       "",
//       `สาเหตุ: ${dwt.Cause && Boolean(dwt.IsOther) ? "อื่นๆ " : ""}${
//         dwt.Cause || "_______________________________________"
//       }`,
//     ]);

//     //* excel
//     const wb = await XlsxPopulate.fromFileAsync(
//       "./public/report/hopper-template.xlsx"
//     );
//     const ws = wb.sheet(0);
//     await fillDataTemplate(ws, logFeedrateRecArr.slice(0, 28), "A7:G34");
//     await fillDataTemplate(ws, logFeedrateRecArr.slice(28), "H7:N34");
//     await fillDataTemplate(ws, logFeedrateDwtArr, "B36:H40");
//     await fillDataTemplate(ws, logFeedrateOpArr, "C42:M43");
//     await ws.row(3).cell(2).value(dymDate(ProdDate));
//     await ws.row(3).cell(9).value(RecpName);
//     await ws.row(3).cell(13).value(LotNo);

//     await writeFile(wb, "FeedrateReport.xlsx");
//     let file = path.join(process.cwd(), "/public/temp/FeedrateReport.xlsx");
//     res.status(200).send({ FilePath: file });
//   } catch (err) {
//     next(err);
//   }
// });
// router.get("/report/download", async (req, res, next) => {
//   try {
//     const { ProdDate, RecpNameID } = req.query;
//     const plan = await getPlanInfo(ProdDate, RecpNameID);
//     if (!plan) return next(createHttpError(404, "ไม่มีข้อมูลแผน"));
//     const { LotNo, RecpName } = plan;
//     const logFeedrateRec = await getLogFeedrateRec(ProdDate, RecpNameID);
//     const logFeedrateDwt = await getLogFeedrateDwt(ProdDate, RecpNameID);
//     const logFeedrateOp = await getLogFeedrateOp(ProdDate, RecpNameID);

//     if (logFeedrateRec.length == 0)
//       return next(createHttpError(404, "ไม่มีข้อมูลการบันทึก"));

//     let logFeedrateOpArr = [];
//     logFeedrateOp.forEach((item) => {
//       logFeedrateOpArr.push([
//         `กะ1 : ${item.ALead1_1Name || "-"}`,
//         "",
//         "",
//         `กะ2 : ${item.ALead2Name || "-"}`,
//         "",
//         `กะ3 : ${item.ALead3Name || "-"}`,
//         "",
//         "",
//         `กะ1 : ${item.ALead1_2Name || "-"}`,
//         "",
//         `วันที่ : ${item.ALeadDate ? dymDate(item.ALeadDate) : "-"}`,
//       ]);
//       logFeedrateOpArr.push([
//         `กะ1 : ${item.Lead1_1Name || "-"}`,
//         "",
//         "",
//         `กะ2 : ${item.Lead2Name || "-"}`,
//         "",
//         `กะ3 : ${item.Lead3Name || "-"}`,
//         "",
//         "",
//         `กะ1 : ${item.Lead1_2Name || "-"}`,
//         "",
//         `วันที่ : ${item.LeadDate ? dymDate(item.LeadDate) : "-"}`,
//       ]);
//     });

//     let logFeedrateRecArr = logFeedrateRec.map((item) => [
//       item.ProdDate,
//       item.BatchNo,
//       item.Shift,
//       item.StartTime,
//       item.BatchEndTime,
//       item.Duration,
//       item.ProdName,
//     ]);

//     let logFeedrateDwtArr = logFeedrateDwt.map((dwt) => [
//       `${dwt.Index}. : ตั้งแต่ ${dwt.StartTime || "______________"} ถึง ${
//         dwt.EndTime || "______________"
//       } รวม ${dwt.Duration || "__________"} นาที`,
//       "",
//       "",
//       "",
//       "",
//       "",
//       `สาเหตุ: ${dwt.Cause && Boolean(dwt.IsOther) ? "อื่นๆ " : ""}${
//         dwt.Cause || "_______________________________________"
//       }`,
//     ]);

//     //* excel
//     const wb = await XlsxPopulate.fromFileAsync(
//       "./public/report/hopper-template.xlsx"
//     );
//     const ws = wb.sheet(0);
//     await fillDataTemplate(ws, logFeedrateRecArr.slice(0, 28), "A7:G34");
//     await fillDataTemplate(ws, logFeedrateRecArr.slice(28), "H7:N34");
//     await fillDataTemplate(ws, logFeedrateDwtArr, "B36:H40");
//     await fillDataTemplate(ws, logFeedrateOpArr, "C42:M43");
//     await ws.row(3).cell(2).value(dymDate(ProdDate));
//     await ws.row(3).cell(9).value(RecpName);
//     await ws.row(3).cell(13).value(LotNo);

//     await writeFile(wb, "FeedrateReport.xlsx");
//     let file = path.join(process.cwd(), "/public/temp/FeedrateReport.xlsx");
//     res.status(200).download(file);
//   } catch (err) {
//     next(err);
//   }
// });

router.post("/", async (req, res, next) => {
  try {
    const {
      RecpNameID,
      ProdDate,
      RecTime,
      Shift,
      ProdUser,
      Feedrate,
    } = req.body;
    const pool = await sql.connect(dbconfig);
    const DupID = await checkDup(
      "LogID",
      "LogFeedrateRec",
      `ProdDate = '${ProdDate}' AND RecpNameID = ${RecpNameID} AND BatchNo = '${BatchNo}'`
    );
    if (DupID)
      return next(
        createHttpError(400, "มีการบันทึกแบชนี้แล้ว, กรุณาสแกน QR Code แบชอื่น")
      );
    if (!StartTime || !ProdUser)
      return next(
        createHttpError(400, "กรุณากรอกรหัสผู้ปฏิบัติงานและเวลาเริ่มเท")
      );
    const Username = await checkDup(
      "Username",
      "MasterUser",
      `Username = N'${ProdUser}'`
    );
    if (!Username) return next(createHttpError(400, "ไม่พบรหัสพนักงาน"));
    await pool.request()
      .query(`INSERT INTO LogFeedrateRec(ProdDate,RecpNameID,Shift,ProdUser,RecTime,Feedrate) 
        VALUES('${ProdDate}',${RecpNameID},${Shift},N'${ProdUser}','${RecTime}', ${Feedrate})`);

    res.status(200).send({ messages: "ok" });
  } catch (err) {
    next(err);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const { LogID, Shift, RecTime, Feedrate } = req.body;
    const pool = await sql.connect(dbconfig);
    await pool.request().query(`UPDATE LogFeedrateRec
            SET Shift = ${Shift}, RecTime = ${RecTime}, Feedrate = ${Feedrate}
            WHERE LogID = ${LogID}`);

    res.status(200).send({ messages: "ok" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
