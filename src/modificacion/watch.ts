import {access, watch} from 'fs';
import {spawn} from 'child_process';

/**
 * Clase que se encarga de observar los cambios en un archivo y ejecutar una
 * función cuando se detecta un cambio.
 * @class
 */
export class WatchFile {
  /**
   * Constructor de la clase.
   * @param {string} file - Nombre del archivo a observar.
   * @param {string} command - Nombre del comando a ejecutar.
   * @param {string[]} args - Argumentos del comando.
   */
  constructor(private file: string, private command: string,
      private args: string[]) {
    access(file, (err) => {
      if (err) {
        console.log(`File ${file} not found`);
        return;
      } else {
        this.run();
      }
    });
  }

  /**
   * Método que se encarga de ejecutar el comando.
   * @return {void}
   * @private
   */
  private run() {
    access(this.file, (err) => {
      if (err) {
        console.log(`${this.file} not found`);
        return;
      } else {
        watch(this.file, (event, filename) => {
          if (event === 'change') {
            const child = spawn(this.command, [...this.args, this.file]);
            let output = '';
            child.stdout.on('data', (data) => {
              output += data;
            });
            child.on('close', () => {
              console.log(output);
            });
          } else {
            console.log(`${filename} has been deleted`);
            throw new Error(`${filename} has been deleted`);
          }
        });
      }
    });
  }
}

/**
 * Procesamineto de la línea de comandos.
 */
const argv = process.argv;

if (argv.length < 3) {
  console.log('Usage: node watch.js <filename>');
  process.exit(1);
}
const file = argv[2];
if (argv.length === 3) {
  new WatchFile(file, 'ls', ['-lh', file]);
} else if (argv.length === 4) {
  new WatchFile(file, argv[3], []);
} else {
  new WatchFile(file, argv[3], argv.slice(4));
}
