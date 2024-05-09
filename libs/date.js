exports.MonthTH = [
  "",
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤษจิกายน",
  "ธันวาคม",
];
exports.MinMonthTH = [
  "",
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

const checkMonth = (date = new Date()) => {
  let today = new Date(date);
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();
  if (mm < 10) {
    mm = "0" + mm;
  }
  return yyyy + mm;
};
const checkDate = (date = new Date()) => {
  let today = new Date(date);
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  return yyyy + "-" + mm + "-" + dd;
};

const addDate = (date = new Date(), number) => {
  var tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + number);
  let dd = tomorrow.getDate();
  let mm = tomorrow.getMonth() + 1;
  let yyyy = tomorrow.getFullYear();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  return yyyy + "-" + mm + "-" + dd;
};

const checkDateTime = (date = new Date()) => {
  let today = new Date(date);
  let hh = today.getHours().toString().padStart(2, "0");
  let mm = today.getMinutes().toString().padStart(2, "0");
  let ss = today.getSeconds().toString().padStart(2, "0");
  let DD = today.getDate().toString().padStart(2, "0");
  let MM = (today.getMonth() + 1).toString().padStart(2, "0");
  let YYYY = today.getFullYear();
  let day = `${YYYY}-${MM}-${DD}`;
  let time = `${hh}:${mm}:${ss}`;
  return day + " " + time;
};

const dmyDateTime = (date = new Date()) => {
  let today = new Date(date);
  let hh = today.getHours().toString().padStart(2, "0");
  let mm = today.getMinutes().toString().padStart(2, "0");
  let ss = today.getSeconds().toString().padStart(2, "0");
  let DD = today.getDate().toString().padStart(2, "0");
  let MM = (today.getMonth() + 1).toString().padStart(2, "0");
  let YYYY = today.getFullYear().toString().substring(2);
  let day = `${DD}-${MM}-${YYYY}`;
  let time = `${hh}:${mm}`;
  return day + " " + time;
};

const ymdDateTimeTrim = (date = new Date()) => {
  let today = new Date(date);
  let hh = today.getHours().toString().padStart(2, "0");
  let mm = today.getMinutes().toString().padStart(2, "0");
  let DD = today.getDate().toString().padStart(2, "0");
  let MM = (today.getMonth() + 1).toString().padStart(2, "0");
  let YYYY = today.getFullYear().toString().substring(2);
  let day = `${YYYY}${MM}${DD}`;
  let time = `${hh}${mm}`;
  return day + time;
};

const dymDate = (date) => {
  let today = new Date(date);
  let dd = today.getDate().toString().padStart(2, "0");
  let mm = (today.getMonth() + 1).toString().padStart(2, "0");
  let yyyy = today.getFullYear();
  return dd + "/" + mm + "/" + yyyy;
};
const dymDateMin = (date) => {
  let today = new Date(date);
  let dd = today.getDate().toString().padStart(2, "0");
  let mm = (today.getMonth() + 1).toString().padStart(2, "0");
  let yyyy = today.getFullYear().toString().substring(2);
  return dd + "/" + mm + "/" + yyyy;
};

const dymDateThMin = (date) => {
  let today = new Date(date);
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yy = (today.getFullYear() + 543).toString().substring(2);
  return dd + " " + this.MinMonthTH[mm] + " " + yy;
};

const dymDateTh = (date) => {
  let today = new Date(date);
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yy = (today.getFullYear() + 543).toString().substring(-2);
  return dd + " " + this.MonthTH[mm] + " " + yy;
};

const ymDateTh = (date) => {
  let today = new Date(date);
  let mm = today.getMonth() + 1;
  let yy = today.getFullYear() + 543;
  return this.MonthTH[mm] + " " + yy;
};

const diffDate = (before = new Date(), after = new Date()) => {
  const date1 = new Date(before);
  const date2 = new Date(after);
  const diffTime = date2.getTime() - date1.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const diffMin = (before = new Date(), after = new Date()) => {
  const date1 = new Date(before);
  const date2 = new Date(after);
  const diffTime = date2.getTime() - date1.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60));
  return diffDays;
};

module.exports = {
  checkMonth,
  checkDate,
  checkDateTime,
  dmyDateTime,
  ymdDateTimeTrim,
  dymDate,
  dymDateMin,
  dymDateThMin,
  dymDateTh,
  ymDateTh,
  diffDate,
  diffMin,
  addDate,
};
