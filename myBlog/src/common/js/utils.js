export function formatTime(time) {
  var date = new Date(time);
  var y = date.getFullYear();
  var mon = addZero(date.getMonth() + 1);
  var d = addZero(date.getDate());
  var res = y + '-' + mon + '-' + d;
  return res;
}

function addZero(time) {
  var len = time.toString().length;
  var n = 2;
  while(len < n){
    time = '0' + time;
    len ++;
  }
  return time;
}

