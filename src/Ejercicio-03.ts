import yargs from 'yargs';
import * as fs from 'fs';

yargs
    .command({
      command: 'watch',
      describe: 'Watch for changes in a directory',
      builder: {
        user: {
          describe: 'User of notes',
          demand: true,
          type: 'string',
          alias: 'u',
        },
        path: {
          describe: 'Path of notes',
          demand: true,
          type: 'string',
          alias: 'p',
        },
      },
      handler: (argv) => {
        console.log('Hola');
        watch(argv.path as string, argv.user as string, (err) => {
          if (err) {
            console.log(err);
          }
        });
      },
    })
    .help();

export function watch(dir: string, user: string,
    callback: (err: Error | null) => void) {
  fs.watch(dir, (event, filename) => {
    if (event === 'change') {
      getUser(`${dir}/${filename}`, (fileErr, fileUser) => {
        if (fileErr) {
          callback(fileErr);
        } else {
          console.log(`${filename} has been changed by ${fileUser}`);
        }
      });
    } else {
      fs.stat(`${dir}/${filename}`, (statErr, stat) => {
        if (statErr) {
          console.log(`${filename} has been removed`);
        } else if (stat.isFile()) {
          getUser(`${dir}/${filename}`, (fileErr, fileUser) => {
            if (fileErr) {
              callback(fileErr);
            } else {
              console.log(`${filename} has been created by ${fileUser}`);
            }
          });
        }
      });
    }
  });
}

export function getUser(file: string, callback: (err: Error | null,
  user: string | null) => void) {
  fs.readFile(file, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      const json = JSON.parse(data.toString());
      callback(null, json.user);
    }
  });
}

yargs.parse();
