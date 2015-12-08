'use strict';

const Promise = require('bluebird');
const fsep = Promise.promisifyAll(require('fs-extra'));
const FILE_MISSING = 'ENOENT';

class PackageFolder {
  constructor(folderPath) {
    this.folderPath = folderPath;
  }

  isValid() {
    return fsep
      .stat(this.folderPath)
      .then(s => s.isDirectory())
      .catch(err =>  err.code === FILE_MISSING);
  }

  clear() {
    return fsep
      .rmdir(this.folderPath)
      .catch(err => {
        if(err.code === FILE_MISSING){
          return Promise.resolve();
        }
        throw err;
      })
      .then(() => fsep.mkdir(this.folderPath));
  }
}

module.exports = PackageFolder;
