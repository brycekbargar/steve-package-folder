'use strict';

const Promise = require('bluebird');
const fs = require('fs');
const FILE_MISSING = 'ENOENT';

class PackageFolder {
  constructor(folderPath) {
    this.folderPath = folderPath;
  }

  isValid() {
    return Promise
      .promisify(fs.stat)(this.folderPath)
      .then(s => s.isDirectory())
      .catch(err =>  err.code === FILE_MISSING);
  }

  clear() {
    return Promise
      .promisify(fs.rmdir)(this.folderPath)
      .catch(err => {
        console.log(err);
        if(err.code === FILE_MISSING){
          return Promise.resolve();
        }
        throw err;
      });
  }
}

module.exports = PackageFolder;
