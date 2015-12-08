'use strict';

const Promise = require('bluebird');
const fsep = Promise.promisifyAll(require('fs-extra'));

class PackageFolder {
  constructor(folderPath) {
    this.folderPath = folderPath;
  }

  isValid() {
    return fsep
      .ensureDir(this.folderPath)
      .then(() => true)
      .catch(() => false);
  }

  clear() {
    return fsep
      .remove(this.folderPath)
      .then(() => fsep.ensureDir(this.folderPath));
  }
}

module.exports = PackageFolder;
