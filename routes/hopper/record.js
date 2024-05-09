const express = require("express");
const router = express.Router();
const sql = require("mssql");
const dbconfig = require("../../libs/dbconfig");
const path = require("path");
const XlsxPopulate = require("xlsx-populate");
const { dymDate, diffMin, addDate } = require("../../libs/date");
const { fillDataTemplate, writeFile } = require("../../libs/reportUtil");
const {
  getLogHopperRec,
  getLogHopperDwt,
  getLogHopperList,
  getLogHopperOp,
  getPlanInfo,
} = require("../../controllers/hopper.controller");
const createHttpError = require("http-errors");
const { checkDup } = require("../../libs/sqlUtils");

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
    const plan = await getPlanInfo(ProdDate, RecpNameID);
    if (!plan) return next(createHttpError(404, "ไม่มีข้อมูลแผน"));
    const { LotNo, RecpName } = plan;
    const logHopperRec = await getLogHopperRec(ProdDate, RecpNameID);
    const logHopperDwt = await getLogHopperDwt(ProdDate, RecpNameID);
    const logHopperOp = await getLogHopperOp(ProdDate, RecpNameID);

    if (logHopperRec.length == 0)
      return next(createHttpError(404, "ไม่มีข้อมูลการบันทึก"));

    let logHopperOpArr = [];
    logHopperOp.forEach((item) => {
      logHopperOpArr.push([
        `กะ1 : ${item.ALead1_1Name || "-"}`,
        "",
        "",
        `กะ2 : ${item.ALead2Name || "-"}`,
        "",
        `กะ3 : ${item.ALead3Name || "-"}`,
        "",
        "",
        `กะ1 : ${item.ALead1_2Name || "-"}`,
        "",
        `วันที่ : ${item.ALeadDate ? dymDate(item.ALeadDate) : "-"}`,
      ]);
      logHopperOpArr.push([
        `กะ1 : ${item.Lead1_1Name || "-"}`,
        "",
        "",
        `กะ2 : ${item.Lead2Name || "-"}`,
        "",
        `กะ3 : ${item.Lead3Name || "-"}`,
        "",
        "",
        `กะ1 : ${item.Lead1_2Name || "-"}`,
        "",
        `วันที่ : ${item.LeadDate ? dymDate(item.LeadDate) : "-"}`,
      ]);
    });

    let logHopperRecArr = logHopperRec.map((item) => [
      item.ProdDate,
      item.BatchNo,
      item.Shift,
      item.StartTime,
      item.BatchEndTime,
      item.Duration,
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
    res.status(200).send({ FilePath: file });
  } catch (err) {
    next(err);
  }
});
router.get("/report/download", async (req, res, next) => {
  try {
    const { ProdDate, RecpNameID } = req.query;
    const plan = await getPlanInfo(ProdDate, RecpNameID);
    if (!plan) return next(createHttpError(404, "ไม่มีข้อมูลแผน"));
    const { LotNo, RecpName } = plan;
    const logHopperRec = await getLogHopperRec(ProdDate, RecpNameID);
    const logHopperDwt = await getLogHopperDwt(ProdDate, RecpNameID);
    const logHopperOp = await getLogHopperOp(ProdDate, RecpNameID);

    if (logHopperRec.length == 0)
      return next(createHttpError(404, "ไม่มีข้อมูลการบันทึก"));

    let logHopperOpArr = [];
    logHopperOp.forEach((item) => {
      logHopperOpArr.push([
        `กะ1 : ${item.ALead1_1Name || "-"}`,
        "",
        "",
        `กะ2 : ${item.ALead2Name || "-"}`,
        "",
        `กะ3 : ${item.ALead3Name || "-"}`,
        "",
        "",
        `กะ1 : ${item.ALead1_2Name || "-"}`,
        "",
        `วันที่ : ${item.ALeadDate ? dymDate(item.ALeadDate) : "-"}`,
      ]);
      logHopperOpArr.push([
        `กะ1 : ${item.Lead1_1Name || "-"}`,
        "",
        "",
        `กะ2 : ${item.Lead2Name || "-"}`,
        "",
        `กะ3 : ${item.Lead3Name || "-"}`,
        "",
        "",
        `กะ1 : ${item.Lead1_2Name || "-"}`,
        "",
        `วันที่ : ${item.LeadDate ? dymDate(item.LeadDate) : "-"}`,
      ]);
    });

    let logHopperRecArr = logHopperRec.map((item) => [
      item.ProdDate,
      item.BatchNo,
      item.Shift,
      item.StartTime,
      item.BatchEndTime,
      item.Duration,
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
    res.status(200).download(file);
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
    const DupID = await checkDup(
      "LogID",
      "LogHopperRec",
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
    let StartDatetime = StartTime ? `'${ProdDate} ${StartTime}'` : null;
    let EndDatetime = BatchEndTime ? `'${ProdDate} ${BatchEndTime}'` : null;
    if (
      StartDatetime &&
      EndDatetime &&
      diffMin(
        StartDatetime.replaceAll("'", ""),
        EndDatetime.replaceAll("'", "")
      ) < 0
    )
      EndDatetime = `'${addDate(ProdDate, 1)} ${BatchEndTime}'`;
    await pool.request()
      .query(`INSERT INTO LogHopperRec(ProdDate,RecpNameID,BatchNo,Shift,ProdUser,StartTime,BatchEndTime) 
        VALUES('${ProdDate}',${RecpNameID},'${BatchNo}',${Shift},N'${ProdUser}',${StartDatetime}, ${EndDatetime})`);

    res.status(200).send({ messages: "ok" });
  } catch (err) {
    next(err);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const { LogID, Shift, ProdDate, StartTime, BatchEndTime } = req.body;
    const pool = await sql.connect(dbconfig);
    let StartDatetime = StartTime ? `'${ProdDate} ${StartTime}'` : null;
    let EndDatetime = BatchEndTime ? `'${ProdDate} ${BatchEndTime}'` : null;
    if (
      StartDatetime &&
      EndDatetime &&
      diffMin(
        StartDatetime.replaceAll("'", ""),
        EndDatetime.replaceAll("'", "")
      ) < 0
    )
      EndDatetime = `'${addDate(ProdDate, 1)} ${BatchEndTime}'`;
    await pool.request().query(`UPDATE LogHopperRec
            SET Shift = ${Shift}, StartTime = ${StartDatetime}, BatchEndTime = ${EndDatetime}
            WHERE LogID = ${LogID}`);

    res.status(200).send({ messages: "ok" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
