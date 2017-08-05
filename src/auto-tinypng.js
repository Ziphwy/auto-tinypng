const path = require('path');
const tinify = require('tinify');
const fileUtils = require('./file-utils');

function log(...args) {
  process.stdout.write(`[AutoTinypng] ${args.join('')}\n`);
}

function dealError(err) {
  if (err instanceof tinify.AccountError) {
    log('Verify your API key and account limit.');
  } else if (err instanceof tinify.ClientError) {
    log('Check your source image and request options.');
  } else if (err instanceof tinify.ServerError) {
    log('Temporary issue with the Tinify API.');
  } else if (err instanceof tinify.ConnectionError) {
    log('A network connection error occurred.');
  } else {
    log(err.message);
  }
}

function parseTarget(image, source, target) {
  return path.resolve(target, path.relative(source, image));
}

/**
 * @constructor
 * @param {Object} options
 */
function Tinypng(options) {
  this.tinify = tinify;
  this.regexp = options.regexp || /\.(png|jpe?g)$/;
  this.key = tinify.key = options.key;
  this.compressionsThisMonth = this.tinify.compressionCount;
}

Tinypng.prototype.compress = function compress(source, target) {
  log('TaskStart!');
  return coreCompress.call(this, source, target);
};

Tinypng.prototype.compressAll = function compressAll(dirname, dist) {
  log('TaskStart!');
  return fileUtils.readAllFile(dirname)
    .then(source => compressTasks.call(this, source, dirname, dist));
};

function compressTasks(sources, dirname, dist) {
  let promise,
    completed = 0;
  const total = sources.length;
  const taskPromise = [];
  sources.forEach((image) => {
    promise = coreCompress.call(this, image, parseTarget(image, dirname, dist)).then(() => {
      completed++;
      log(`Completed progress: ${completed}/${total}`);
    });
    taskPromise.push(promise);
  });
  return Promise.all(taskPromise).then(() => {
    this.compressionsThisMonth = this.tinify.compressionCount;
    log('Finish Tasks!');
    log(`Success: ${completed}, Fail: ${total - completed}, CompressTimes: ${this.tinify.compressionCount}`);
  });
}

function coreCompress(source, target) {
  if (!this.regexp.test(source)) {
    log('The file is not matched by regexp');
    return Promise.resolve();
  }

  const targetDir = path.dirname(target);
  return fileUtils.mkdir(targetDir)
    .then(() => this.tinify.fromFile(source).toFile(target))
    .then(() => log(`Image "${source}" is compressed success!`))
    .catch((err) => {
      dealError(err);
      return Promise.reject(err);
    });
}

module.exports = Tinypng;
