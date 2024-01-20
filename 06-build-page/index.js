const path = require('path');
const fs = require('fs');

fs.stat(path.join(__dirname, 'project-dist'), (err) => {
  if (err) {
    build();
  } else {
    fs.rm(
      path.join(__dirname, 'project-dist'),
      { recursive: true, force: true },
      (err) => {
        if (err) throw err;
        build();
      },
    );
  }
});

function build() {
  fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
    if (err) throw err;
    fs.mkdir(
      path.join(__dirname, 'project-dist', 'assets'),
      { recursive: true },
      (err) => {
        if (err) throw err;
        copyAssets(path.join(__dirname, 'assets'));
      },
    );
    fs.copyFile(
      path.join(__dirname, 'template.html'),
      path.join(__dirname, 'project-dist', 'index.html'),
      (err) => {
        if (err) throw err;
        updateHTML();
      },
    );
    fs.writeFile(
      path.join(__dirname, 'project-dist', 'style.css'),
      '',
      (err) => {
        if (err) {
          console.log(err);
        }
        fs.readdir(path.join(__dirname, 'styles'), (err, items) => {
          const output = fs.createWriteStream(
            path.join(__dirname, 'project-dist', 'style.css'),
          );
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
      },
    );
  });
}

function copyAssets(dir) {
  fs.readdir(dir, (err, files) => {
    let dirStr = String(dir).trim();
    let dirAsset = dirStr.slice(
      dirStr.indexOf('assets') !== -1
        ? dirStr.indexOf('assets')
        : dirStr.length,
    );
    if (err) throw err;
    for (let i = 0; i < files.length; i++) {
      fs.stat(path.join(dir, files[i]), (err, stats) => {
        if (stats.isFile()) {
          fs.copyFile(
            path.join(dir, files[i]),
            path.join(__dirname, 'project-dist', dirAsset, files[i]),
            (err) => {
              if (err) throw err;
            },
          );
        } else {
          fs.mkdir(
            path.join(__dirname, 'project-dist', dirAsset, files[i]),
            { recursive: true },
            (err) => {
              if (err) throw err;
              copyAssets(path.join(dir, files[i]));
            },
          );
        }
      });
    }
  });
}

function updateHTML() {
  fs.readdir(path.join(__dirname, 'components'), (err, files) => {
    let comp = files.map((x) => `{{${x.slice(0, -5)}}}`);

    fs.readFile(
      path.join(__dirname, 'project-dist', 'index.html'),
      (error, dataIndex) => {
        if (error) return console.error(error.message);
        for (let i = 0; i < comp.length; i++) {
          let componentName = `${comp[i].slice(2, -2)}.html`;
          fs.readFile(
            path.join(__dirname, 'components', componentName),
            (error, dataTempl) => {
              if (error) return console.error(error.message);
              if (dataIndex.includes(comp[i])) {
                let startChunk = dataIndex.slice(0, dataIndex.indexOf(comp[i]));
                let lastChunk = dataIndex.slice(
                  dataIndex.indexOf(comp[i]) + comp[i].length,
                );
                dataIndex = startChunk;
                dataIndex += dataTempl;
                dataIndex += lastChunk;
              }
              fs.writeFile(
                path.join(__dirname, 'project-dist', 'index.html'),
                dataIndex,
                (error) => {
                  if (error) return console.error(error.message);
                },
              );
            },
          );
        }
      },
    );
  });
}
