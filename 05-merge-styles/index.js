const path = require('path');
const fs = require('fs');

const output = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);

fs.stat(path.join(__dirname, 'project-dist', 'bundle.css'), (err) => {
  if (err) {
    fs.writeFile(
      path.join(__dirname, 'project-dist', 'bundle.css'),
      '',
      (err) => {
        if (err) {
          console.log(err);
        }
      },
    );
  }
});

fs.readdir(path.join(__dirname, 'styles'), (err, items) => {
  items.forEach((x) => {
    fs.stat(path.join(__dirname, 'styles', x), () => {
      if (x.split('.').at(-1) === 'css') {
        const input = fs.createReadStream(
          path.join(__dirname, 'styles', x),
          'utf-8',
        );
        input.pipe(output);
      }
    });
  });
});
