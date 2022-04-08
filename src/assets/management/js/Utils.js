export function formatDateTime (timeStamp) {
  if (!timeStamp) {
    return '';
  }
  // let date = new Date(Number(timeStamp));
  // let dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  // let timeStr = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  // return dateStr + ' ' + timeStr
  let date = new Date(Number(timeStamp) + 8 * 3600 * 1000)
  let dateStr = date.toISOString().replace('T', ' ');
  dateStr = dateStr.substring(0, dateStr.indexOf('.'));
  return dateStr
}

export function formatDate(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month < 10 ? '0' + month : month;
  let day = date.getDate();
  day = day < 10 ? '0' + day : day;
  return year + '-' + month + '-' + day
}

// function padLeftZero(str) {
//   return ('00' + str).substr(str.length)
// }
