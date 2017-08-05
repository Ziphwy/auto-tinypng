const should = require('should');
const path = require('path');
const fs = require('fs');
const fileUitls = require('../src/file-utils');


describe('test case of file-reader', () => {
  const testDir = path.resolve(__dirname, 'dir');
  const noExistDir = path.resolve(__dirname, '../test-tmp/none');

  it('read dir success then return promise', () =>
    fileUitls.readDir(testDir).then((files) => {
      files.should.be.an.Array().and.deepEqual(['a.png', 'b.png', 'sub']);
    }));

  it('read dir error and catch', (done) => {
    fileUitls.readDir(noExistDir).catch(() => {
      done();
    });
  });

  it('get stats success then return promise', () =>
    fileUitls.stat(testDir).then((stat) => {
      stat.should.has.a.property('uid');
    }));

  it('read dir error and catch', (done) => {
    fileUitls.stat(noExistDir).catch(() => {
      done();
    });
  });

  it('read all files under the directory', () =>
    fileUitls.readAllFile(testDir).then((files) => {
      files.should.be.an.Array().and.deepEqual([
        path.resolve(__dirname, './test-tmp/a.png'),
        path.resolve(__dirname, './test-tmp//b.png'),
        path.resolve(__dirname, './test-tmp//sub/c.png'),
      ]);
    }));

  it('make resolve directory', (done) => {
    const dir = path.resolve(__dirname, '../mk-rsv-dir');
    fileUitls.mkdir(dir).then(() => {
      should(fs.accessSync(dir)).be.undefined();
      done();
    });
  });

  it('make relative directory', (done) => {
    const dir = '../test-tmp/mk-rltv-dir';
    fileUitls.mkdir(dir).then(() => {
      should(fs.accessSync(dir)).be.undefined();
      done();
    });
  });

  it('make exist directory', (done) => {
    const dir = path.resolve(__dirname, '../test-tmp/duplicate');
    Promise.all([fileUitls.mkdir(dir), fileUitls.mkdir(dir)])
      .then(() => {
        should(fs.accessSync(dir)).be.undefined();
        done();
      });
  });

  it('make nest directory', (done) => {
    const dir = path.resolve(__dirname, '../test-tmp/a/b/c');
    fileUitls.mkdir(dir).then(() => {
      should(fs.accessSync(dir)).be.undefined();
      done();
    });
  });
});
