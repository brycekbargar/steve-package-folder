'use strict';

const path = require('path');
const Promise = require('bluebird');
const fsep = Promise.promisifyAll(require('fs-extra'));

class PackageFolder {
  constructor(folderPath) {
    this.folderPath = folderPath;

    this.isValid = () => {
      return fsep
        .ensureDirAsync(this.folderPath)
        .then(() => true)
        .catch(() => false);
    };

    this.clear = () => {
      return fsep
        .removeAsync(this.folderPath)
        .then(() => fsep.ensureDirAsync(this.folderPath));
    };

    this.add = (index, filePath) => {
      let fileName = ('000' + index + '_').slice(-4) + path.basename(filePath);
      return fsep
        .copyAsync(filePath, path.join(this.folderPath, fileName));
    };
  }
}

module.exports = PackageFolder;
