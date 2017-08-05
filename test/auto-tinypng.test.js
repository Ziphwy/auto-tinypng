const path = require('path');
const should = require('should');
const fs = require('fs');
const Tinypng = require('../src/auto-tinypng');

/** @type {Tinypng} */
const tinypng = new Tinypng({
  key: 'qNcNgNXOU6mOC0gJlnrlGzw3sDcpOcC4',
});

describe('tinypng compress', function () {
  this.timeout(999999);
  it('test compress a image', (done) => {
    const source = path.resolve(__dirname, 'dir/a.png');
    const target = path.resolve(__dirname, '../test-tmp/target/a.png');
    tinypng.compress(source, target)
      .then(() => {
        fs.stat(source, (err1, sourceStat) => {
          if (err1) return;
          fs.stat(target, (err2, targetStat) => {
            if (err2) return;
            targetStat.size.should.be.below(sourceStat.size);
            done();
          });
        });
      });
  });

  it('test compress all images of directory', (done) => {
    const source = path.resolve(__dirname, 'dir');
    const target = path.resolve(__dirname, '../test-tmp/target-all');
    tinypng.compressAll(source, target)
      .then(() => {
        fs.stat(source, (err1, sourceStat) => {
          if (err1) return;
          fs.stat(target, (err2, targetStat) => {
            if (err2) return;
            // targetStat.size.should.be.below(sourceStat.size);
            done();
          });
        });
      });
  });
});
