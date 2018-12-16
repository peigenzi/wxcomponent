const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const stringNum = (tar, num = 5) => {
  if(tar && tar.length > num) {
    tar = tar.trim();
    if(!tar) {
      return '匿名';
    } else {
      return tar.slice(0, num) + '...';
    }
  }

  return tar;
}

module.exports = {
  formatTime: formatTime,
  stringNum: stringNum
}
