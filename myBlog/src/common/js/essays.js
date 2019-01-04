export default class Essay {
  constructor({time,content,img}){
    this.time = time;
    this.content = content;
    this.img = img;
  }
}

var url = 'http://localhost:3000/avatar/';

export function createEssay(essayList) {
  return new Essay({
    time: normalizeTime(essayList.addTime),
    content: essayList.content,
    img: doImg(essayList.user.avatar)
  })
}

function doImg(avatar) {
  return `${url}${avatar}`
}

export function normalizeTime(time) {
  var date = new Date(Number(time));
  var y = date.getFullYear();
  var mon = addZero(date.getMonth() + 1);
  var d = addZero(date.getDate());
  var h = addZero(date.getHours());
  var m = addZero(date.getMinutes());
  var res = y + '-' + mon + '-' + d + ' ' + h + ':' + m;
  return res;
}

function addZero(time) {
  var len = time.toString().length;
  var n = 2;
  if(len < n){
    time = '0' + time;
    len ++;
  }
  return time;
}

/**
 * Guid
 */
export const Guid = () => {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
