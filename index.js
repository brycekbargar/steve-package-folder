'use strict';

const Promise = require('bluebird');
const fs = require('fs');

class PackageFolder {
  constructor(folderPath) {
    this.folderPath = folderPath;
  }

  isValid() {
    return Promise
      .promisify(fs.stat)(this.folderPath)
      .then(s => s.isDirectory())
      .catch(err =>  err.code === 'ENOENT');
  }
}

module.exports = PackageFolder;
