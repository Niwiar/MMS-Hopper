var today = new Date();
var date =
  today.getFullYear() +
  "-" +
  String(today.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(today.getDate()).padStart(2, "0");
var time =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + " " + time;
$("#currentDateTime").text(dateTime);

const dymDate = (date) => {
  let today = new Date(date);
  let dd = today.getDate().toString().padStart(2, "0");
  let mm = (today.getMonth() + 1).toString().padStart(2, "0");
  let yyyy = today.getFullYear();
  return dd + "/" + mm + "/" + yyyy;
};

const checkTime = (date) => {
  let today = new Date(date);
  let hh = today.getHours().toString().padStart(2, "0");
  let mm = today.getMinutes().toString().padStart(2, "0");
  let ss = today.getSeconds().toString().padStart(2, "0");
  let time = `${hh}:${mm}:${ss}`;
  return time;
};

