const _ = require('lodash');
const uuid = require('uuid');
const chalk = new (require('chalk')).constructor({enabled: true});
const R = require('ramda');

let colors = [
  chalk.red,
  chalk.green,
  chalk.yellow,
  chalk.blue,
  chalk.magenta,
  chalk.cyan,
  chalk.white,
  chalk.gray
];

let getColorFn = (id) => {
  let fn = R.pipe(
    R.map(c => c.charCodeAt()),
    R.sum,
    s => s % colors.length,
    R.prop(R.__, colors)
  )(id);

  return fn;
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

  return `${getColorFn(name)(name)} -> ${chalk.red(s)} avg: ${chalk.bold.cyan(a)}`;
};

function stopAverage(timingId, name) {
  let s = stop(timingId);
  let a = Math.round(avg(name, s));

  return `${getColorFn(name)(name)} -> ${chalk.red(s)} avg: ${chalk.bold.cyan(a)}`;
}

module.exports = {
  start,
  split,
  stop,
  avg,
  splitAverage,
  stopAverage
};
