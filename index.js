module.exports = function(folderPath, cb) {
  require('fs').lstat(folderPath, (err) => {
    cb(err);
  });
};
