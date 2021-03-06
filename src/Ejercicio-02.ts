import {spawn} from 'child_process';
import {access, constants} from 'fs';
import yargs from 'yargs';

/**
 * Manejo de argumentos por línea de comandos
 */
yargs
    .command({
      command: 'search',
      describe: 'Search the number of words repeated in a file',
      builder: {
        file: {
          describe: 'File to search',
          demandOption: true,
          type: 'string',
        },
        word: {
          describe: 'Word to search',
          demandOption: true,
          type: 'string',
        },
        method: {
          describe: 'Method to search',
          demandOption: true,
          type: 'string',
          choices: ['pipe', 'subprocess'],
        },
      },
      handler: (argv) => {
        const {file, word, method} = argv;
        if (method === 'pipe') {
          searchPipe(file as string, word as string, (err, count) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`The word '${word}' appears ${count} times`);
            }
          });
        }
        if (method === 'subprocess') {
          searchSubprocess(file as string, word as string, (err, count) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`The word '${word}' appears ${count} times`);
            }
          });
        }
      },
    })
    .help();

yargs.parse();

/**
 * Busca el número de veces que aparece una palabra en un archivo mediante
 * el uso de una tubería.
 * @param file File to search
 * @param word Word to search
 * @param callback Callback
 */
export function searchPipe(file: string, word: string, callback:
    (err: NodeJS.ErrnoException | null, count: number) => void) {
  access(file, constants.F_OK, (err) => {
    if (err) {
      callback(err, 0);
    }
    const catStream = spawn('cat', [file]);
    const grepStream = spawn('grep', ['-o', word]);
    catStream.stdout.pipe(grepStream.stdin);
    grepStream.stdout.on('data', (data) => {
      const count = data.toString().split('\n').length - 1;
      callback(null, count);
    });
  });
}

/**
 * Busca el número de veces que aparece una palabra en un archivo mediante
 * el uso de subprocesos.
 * @param file File to search
 * @param word Word to search
 * @param callback Callback
 */
export function searchSubprocess(file: string, word: string, callback:
    (err: NodeJS.ErrnoException | null, count: number) => void) {
  access(file, constants.F_OK, (err) => {
    if (err) {
      callback(err, 0);
    }
    const grepStream = spawn('grep', ['-o', word, file]);
    grepStream.stdout.on('data', (data) => {
      const count = data.toString().split('\n').length - 1;
      callback(null, count);
    });
  });
}
