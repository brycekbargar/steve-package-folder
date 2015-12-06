# Steve Package Folder #
A wrapper for performing actions on the package folder in [`steve`](https://www.github.com/brycekbargar/steve) packages.

### Usage ###
Right now the package is a single function that has two parameters

1. The absolute path the folder
1. A callback for when the function is loaded.

The callback should take two parameters

1. Any `Error` that ocurred while loading the file. This will be null if there are no errors.
1. An object with two functions
  - `clear`: removes all files in the package folder
  - `add`: copies the file at the passed absolute path to the package folder adding a prefix in the format of `000_` which increments for each file added.


```
var packageFolder = require('chuck-steve-package-folder'):

var onLoad = function(err, folder) {
  if(err) {
    console.error(err):
    return;
  }

  folder.clear();
  folder.add(somePathToAFile):
  folder.add(somePathToAnotherFile):
}

packageFolder('./packages', onLoad);
```

### Possible Errors ###
An error may be returned for the following cases

1. The folder couldn't be found or created
