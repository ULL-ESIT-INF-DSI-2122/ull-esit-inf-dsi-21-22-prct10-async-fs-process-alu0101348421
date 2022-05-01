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

/**
 * Watch for changes in a directory
 * @param dir Path of the directory
 * @param user User of the notes
 * @param callback Callback
 */
export function watch(dir: string, user: string,
    callback: (err: Error | null) => void) {
  fs.watch(dir, (event, filename) => {
    if (event === 'change') {
      getUser(`${dir}/${filename}`, (fileErr, fileUser) => {
        if (fileErr) {
          callback(fileErr);
        } else if (fileUser === user) {
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
            } else if (fileUser === user) {
              console.log(`${filename} has been created by ${fileUser}`);
            }
          });
        }
      });
    }
  });
}

/**
 * Get the user of a note
 * @param file Path of the file
 * @param callback Callback
 */
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
