const { stdin, stdout } = process;
const path = require('path');
const fs = require('fs');

stdout.write('Write something\n');
stdin.on('data', (dataWrite) => {
  if (dataWrite.toString().trim() === 'exit') process.exit();
  fs.stat(path.join(__dirname, 'text.txt'), (err) => {
    if (err) {
      fs.writeFile(path.join(__dirname, 'text.txt'), dataWrite, (error) => {
        if (error) return console.error(error.message);
      });
    } else {
      fs.readFile(path.join(__dirname, 'text.txt'), (error, data) => {
        if (error) return console.error(error.message);
        const notes = data + dataWrite;

        fs.writeFile(path.join(__dirname, 'text.txt'), notes, (error) => {
          if (error) return console.error(error.message);
        });
      });
    }
  });
});

process.on('SIGINT', function () {
  process.exit();
});

process.on('exit', () => stdout.write('Goodbye!'));
