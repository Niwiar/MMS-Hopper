const sql = require("mssql");
const dbconfig = require("../libs/dbconfig");
const { fromToFilter } = require("../libs/sqlUtils");
const { checkDate } = require("../libs/date");

exports.getRecpName = async (RecpNameID) => {
  const pool = await sql.connect(dbconfig);
  const Recp = await pool.request().query(`SELECT RecpName
    FROM [MasterRecipeName]
    WHERE RecpNameID = ${RecpNameID}`);
  return Recp.recordset[0]?.RecpName;
};

exports.getPlanInfo = async (ProdDate, RecpNameID) => {
  const pool = await sql.connect(dbconfig);
  const Plan = await pool.request().query(`SELECT TOP 1 LotNo, RecpName, LocationName
    FROM [viewPlanInfo]
    WHERE RecpNameID = ${RecpNameID}
        AND ProdDate = '${ProdDate}'`);
  return Plan.recordset[0];
};

exports.getLogHopperList = async (FromDate, ToDate) => {
  const pool = await sql.connect(dbconfig);
  const logHopperList = await pool.request().query(
    `SELECT TOP 200 row_number() over(order by loghr.ProdDate desc) as 'Index',
        CONVERT(varchar,loghr.ProdDate,23) ProdDate,         
        CONVERT(varchar,loghr.ProdDate,105) ProdDateShow,
        loghr.RecpNameID, vpi.RecpName, vpi.LotNo, vpi.LocationName
      FROM [viewPlanInfo] vpi
      RIGHT JOIN [LogHopperRec] loghr on vpi.ProdDate = loghr.ProdDate and vpi.RecpNameID = loghr.RecpNameID
      ${!FromDate && !ToDate ? '' : `WHERE ${fromToFilter(
        "loghr.ProdDate",
        FromDate || checkDate(),
        ToDate,"")
      }`}
      GROUP BY loghr.ProdDate, loghr.RecpNameID, vpi.RecpName, vpi.LotNo, vpi.LocationName
      ORDER BY loghr.ProdDate desc`
  );
  
  
  return logHopperList?.recordset||[];
};

exports.getLogHopperRec = async (ProdDate, RecpNameID) => {
  const pool = await sql.connect(dbconfig);
  const logHopperRec = await pool.request().query(
    `SELECT loghr.LogID, CONVERT(varchar,loghr.ProdDate,105) ProdDate,
        loghr.BatchNo, loghr.Shift,
        CONVERT(varchar,loghr.StartTime,8) StartTime,
        CONVERT(varchar,loghr.BatchEndTime,8) BatchEndTime,
        DATEDIFF(minute,loghr.StartTime,loghr.BatchEndTime) Duration, mu.Name ProdName
      FROM [LogHopperRec] loghr
      LEFT JOIN [MasterUser] mu on loghr.ProdUser = mu.Username
      WHERE loghr.ProdDate = '${ProdDate}' AND loghr.RecpNameID = ${RecpNameID}
      ORDER BY loghr.BatchNo`
  );
  return logHopperRec.recordset;
};

exports.getLogHopperOp = async (ProdDate, RecpNameID) => {
  const pool = await sql.connect(dbconfig);
  const logHopperOp = await pool.request().query(
    `SELECT loghr.LogID, CONVERT(varchar,loghr.ProdDate,105) ProdDate,
                loghr.BatchNo, loghr.Shift,
                CONVERT(varchar,loghr.StartTime,8) StartTime,
                CONVERT(varchar,loghr.BatchEndTime,8) BatchEndTime,
                DATEDIFF(minute,loghr.StartTime,loghr.BatchEndTime) Duration, mu.Name ProdName
            FROM [LogHopperOp] loghr
            LEFT JOIN [MasterUser] mu on loghr.ProdUser = mu.Username
            WHERE loghr.ProdDate = '${ProdDate}' AND loghr.RecpNameID = ${RecpNameID}`
  );
  return logHopperOp.recordset;
};

exports.getLogHopperDwt = async (ProdDate, RecpNameID) => {
  const pool = await sql.connect(dbconfig);
  const logHopperDwt = await pool.request().query(
    `SELECT row_number() over(order by LogID) as 'Index', LogID,
                CONVERT(varchar,StartTime,8) StartTime,
                CONVERT(varchar,EndTime,8) EndTime,
                DATEDIFF(minute,StartTime,EndTime) Duration,IsOther, Cause
            FROM [LogHopperDwt]
            WHERE ProdDate = '${ProdDate}' AND RecpNameID = ${RecpNameID}`
  );
  return logHopperDwt.recordset;
};

exports.getLogHopperOp = async (ProdDate, RecpNameID) => {
    const pool = await sql.connect(dbconfig);
    const logHopperOp = await pool.request().query(
        `SELECT LogID,
            Lead1_1, ALead1_1, Lead2, ALead2,
            Lead3, ALead3, Lead1_2, ALead1_2,
            mul1_1.Name + ' ' + mul1_1.Surname Lead1_1Name,
            mual1_1.Name + ' ' + mual1_1.Surname ALead1_1Name,
            mul2.Name + ' ' + mul2.Surname Lead2Name,
            mual2.Name + ' ' + mual2.Surname ALead2Name,
            mul3.Name + ' ' + mul3.Surname Lead3Name,
            mual3.Name + ' ' + mual3.Surname ALead3Name,
            mul1_2.Name + ' ' + mul1_2.Surname Lead1_2Name,
            mual1_2.Name + ' ' + mual1_2.Surname ALead1_2Name,
            CONVERT(varchar,LeadDate,23) LeadDate,
            CONVERT(varchar,ALeadDate,23) ALeadDate
        FROM [LogHopperOp] lho
        LEFT JOIN [MasterUser] mul1_1 on lho.Lead1_1 = mul1_1.Username
        LEFT JOIN [MasterUser] mual1_1 on lho.ALead1_1 = mual1_1.Username
        LEFT JOIN [MasterUser] mul2 on lho.Lead2 = mul2.Username
        LEFT JOIN [MasterUser] mual2 on lho.ALead2 = mual2.Username
        LEFT JOIN [MasterUser] mul3 on lho.Lead3 = mul3.Username
        LEFT JOIN [MasterUser] mual3 on lho.ALead3 = mual3.Username
        LEFT JOIN [MasterUser] mul1_2 on lho.Lead1_2 = mul1_2.Username
        LEFT JOIN [MasterUser] mual1_2 on lho.ALead1_2 = mual1_2.Username
        WHERE ProdDate = '${ProdDate}' AND RecpNameID = ${RecpNameID}`
    );
    return logHopperOp.recordset;
  };