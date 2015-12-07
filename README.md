# Steve Package Folder #
A wrapper for performing actions on the package folder in [`steve`](https://www.github.com/brycekbargar/steve) packages.

### Usage ###
Requiring this package returns a `PackageFolder` class. The class has the following methods:

##### `.constructor()` #####
Takes a single string containing the absolute folder path

##### `.isValid()` #####
Returns a `Promise` that resolves to true if the folder can be written to and read from


##### `#clear()` #####
Clears the folder  
Returns a `Promise`

##### `#add(filePath)` #####
Copies the file located at the absolute path into the folder  
Returns a `Promise`

### Example ###
```
const PackageFolder = require('chuck-steve-package-folder');
let packageFolder = new PackageFolder('some folder path');

packageFolder
  .isValid()
  .then((isValid) => {
    if(isValid) {
      return packageFolder
        .clear
        .then(() => return packageFolder.add('some file path'));
    }
  })
  .catch(console.error);
}
```
