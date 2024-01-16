const path = require('path');
const fs = require('fs');

fs.readdir(path.join(__dirname, 'secret-folder'), (err, files) => {
  files.forEach((x) => {
    fs.stat(path.join(__dirname, 'secret-folder', x), (err, stats) => {
      if (stats.isFile()) {
        console.log(
          `${x.split('.')[0]} - ${x.split('.')[1]} - ${stats.size / 1000}kb`,
        );
      }
    });
  });
});
