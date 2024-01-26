exports.fillDataTemplate = async (worksheet, sheetData, range) => {
  try {
    let r = await worksheet.range(range);
    let rowStart = r._minRowNumber;
    let rowEnd = r._maxRowNumber;
    let colStart = r._minColumnNumber;
    let colEnd = r._maxColumnNumber;
    let fillRange = await worksheet.range(rowStart, colStart, rowEnd, colEnd);
    fillRange.value(sheetData);
  } catch (err) {
    console.log(err);
  }
};

exports.fillDataTemplateBorder = async (worksheet, sheetData, range) => {
  try {
    let r = await worksheet.range(range);
    let rowStart = r._minRowNumber;
    let rowEnd = r._maxRowNumber;
    let colStart = r._minColumnNumber;
    let colEnd = r._maxColumnNumber;
    let fillRange = await worksheet.range(rowStart, colStart, rowEnd, colEnd);
    fillRange
      .value(sheetData)
      .style("borderStyle", "thin")
      .style("horizontalAlignment", "center");
  } catch (err) {
    console.log(err);
  }
};

exports.writeFile = async (workbook, filename) => {
  try {
    await workbook.toFileAsync(`public/temp/${filename}`);
  } catch (err) {
    console.log(err);
  }
};

exports.arrangeDataEmpty = async (data) => {
  try {
    let sheet = [];
    for (const item of data) {
      let row = [];
      for (const key in item) {
        if (key == "DwtCase" || key == "NgCase" || key == "AlarmName") {
          row.push(item[key]);
        } else if (key == "Dwt_ID" || key == "Ng_ID" || key == "Alarm_ID") {
          continue;
        } else {
          row.push(parseFloat(item[key]) || "");
        }
      }
      sheet.push(row);
    }
    return sheet;
  } catch (err) {
    console.log(err);
  }
};

exports.arrangeDataZero = async (data) => {
  try {
    let sheet = [];
    for (const item of data) {
      let row = [];
      for (const key in item) {
        if (key == "DwtCase" || key == "NgCase" || key == "AlarmName") {
          row.push(item[key]);
        } else if (key == "Dwt_ID" || key == "Ng_ID" || key == "Alarm_ID") {
          continue;
        } else {
          row.push(parseFloat(item[key]) || 0);
        }
      }
      sheet.push(row);
    }
    return sheet;
  } catch (err) {
    console.log(err);
  }
};
