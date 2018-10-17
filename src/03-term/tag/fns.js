const padEnd = function(str, width) {
  str = str.toString();
  while (str.length < width) {
    str += ' ';
  }
  return str;
};

exports.logTag = function(t, tag, reason) {
  let log = '\x1b[32m' + padEnd(t.normal, 8) + '\x1b[0m #' + tag + '  -' + reason;
  console.log(log);
};

exports.logUntag = function(t, tag, reason) {
  let log = '  ' + padEnd(t.normal, 8) + ' \x1b[31m - #' + tag + '\x1b[0m ';
  if (reason) {
    log = padEnd(log, 35) + ' (' + reason + ')';
  }
  console.log(log);
};

exports.isArray = function(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
};