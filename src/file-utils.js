const fs = require('fs');
const path = require('path');

exports.readAllFile = readAllFile;
exports.readDir = readDir;
exports.stat = stat;
exports.mkdir = mkdir;

function readDir(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, subPaths) => {
      if (err) {
        reject(err);
      } else {
        resolve(subPaths);
      }
    });
  });
}

function stat(pathname) {
  return new Promise((resolve, reject) => {
    fs.stat(pathname, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
}

function _mkdir(dirname, mode) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirname, mode, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function readAllFile(dir) {
  return dirIteratee(dir, []);
}

/**
 * get all files belong to dir
 *
 * @param {String} dir
 * @param {Array} files
 * @returns
 */
function dirIteratee(dir, files) {
  return readDir(dir).then((pathnames) => {
    const promises = [];
    pathnames.forEach((pathname) => {
      const currentPath = path.resolve(dir, pathname);
      const promise = stat(currentPath).then((stats) => {
        if (stats.isDirectory()) {
          return dirIteratee(currentPath, files);
        }
        files.push(currentPath);
      });
      promises.push(promise);
    });
    return Promise.all(promises).then(() => Promise.resolve(files));
  });
}


/**
 * @param {String} url
 * @param {String} mode
 */
function mkdir(url, mode) {
  const pathArr = url.split(path.sep);
  if (pathArr[0] === '') {
    pathArr[0] = '/';
  }
  let currentPath = '';
  return pathArr.reduce((promise, pathname) =>
    promise.then(() => {
      currentPath = path.join(currentPath, pathname);
      return stat(currentPath).catch((err) => {
        if (err.code === 'ENOENT') {
          return _mkdir(currentPath, mode).catch((innerErr) => {
            // 由于异步，存在提交任务的时候没有目录，但是其中一个任务完成时存在目录
            if (innerErr.code === 'EEXIST') {
              return Promise.resolve();
            }
          });
        }
      });
    }), Promise.resolve());
}
