const fs = require('fs');
const path = require('path');

fs.stat(path.join(__dirname, 'files-copy'), (err) => {
  if (err) {
    fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
      if (err) throw err;
    });
    copy();
  } else {
    fs.readdir(path.join(__dirname, 'files-copy'), (err, items) => {
      for (let i = 0; i < items.length; i++) {
        fs.unlink(path.join(__dirname, 'files-copy', items[i]), (err) => {
          if (err) throw err;
        });
      }
    });
    copy();
  }
});

function copy() {
  fs.readdir(path.join(__dirname, 'files'), (err, items) => {
    for (let i = 0; i < items.length; i++) {
      fs.copyFile(
        path.join(__dirname, 'files', items[i]),
        path.join(__dirname, 'files-copy', items[i]),
        (err) => {
          if (err) throw err;
        },
      );
    }
  });
}
