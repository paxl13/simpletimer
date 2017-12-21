const _ = require('lodash');
const uuid = require('uuid');
const colors = require('colors');
colors.enabled = true;

let colorsFn = [
  colors.red,
  colors.green,
  colors.yellow,
  colors.blue,
  colors.magenta,
  colors.cyan,
  colors.white,
  colors.gray
];

let getColorFn = (id) => {
  let charSum = _.reduce(_.map(id, c => c.charCodeAt()), (a, v) => a + v, 0);
  let fnId = charSum % colorsFn.length;
  return colorsFn[fnId];
};

let ts = {
};

let averages = {
};

function getEntry(id) {
  return _.get(ts, id);
}

function getTime() {
  return (new Date).getTime();
}

function start() {
  let id = uuid();
  let t = getTime();

  _.set(ts, id, [t]);

  return id;
}

function split(id) {
  let t = getTime();

  let entry = getEntry(id);
  let last = _.last(entry);

  entry.push(t);

  _.set(ts, id, entry);
  return t - last;
}

function stop(id) {
  let entry = getEntry(id);
  let startTime = _.first(entry);
  let endTime = getTime();

  _.unset(ts, id);

  return endTime - startTime;
}

function avg(name, time) {
  let entry = _.get(averages, name, {n: 0, t: 0});

  entry.n++;
  entry.t += time;

  _.set(averages, name, entry);
  return entry.t / entry.n;
}

function splitAverage(timingId, name) {
  let s = split(timingId);
  let a = Math.round(avg(name, s));

  return `${getColorFn(name)(name)} -> ${colors.red(s)} avg: ${colors.bold.cyan(a)}`;
};

function stopAverage(timingId, name) {
  let s = stop(timingId);
  let a = Math.round(avg(name, s));

  return `${getColorFn(name)(name)} -> ${colors.red(s)} avg: ${colors.bold.cyan(a)}`;
}

module.exports = {
  start,
  split,
  stop,
  avg,
  splitAverage,
  stopAverage
};
