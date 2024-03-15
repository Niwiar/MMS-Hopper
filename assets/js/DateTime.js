var today = new Date();
var date = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate() + 1).padStart(2, '0');
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + ' ' + time;
$('#currentDateTime').text(dateTime)

const dymDate = (date) => {
  let today = new Date(date);
  let dd = today.getDate().toString().padStart(2, "0");
  let mm = (today.getMonth() + 1).toString().padStart(2, "0");
  let yyyy = today.getFullYear();
  return dd + "/" + mm + "/" + yyyy;
};