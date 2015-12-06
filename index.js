module.exports = function(folderPath, cb) {
  require('fs').mkdir(folderPath, (err) => {
    if(err && err.code !== 'EEXIST') {
      cb(err);
      return;
    }
    cb(null);
  });
};
