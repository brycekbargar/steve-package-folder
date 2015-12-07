'use strict';

const Promise = require('bluebird');
const fs = require('fs');

module.exports = class PackageFolder {
  constructor(folderPath) {
    this.folderPath = folderPath;
  }

  isValid() {
    return Promise
      .promisify(fs.stat)(this.folderPath)
      .catch((err) =>  err.code === 'EEXIST');
  }
};
