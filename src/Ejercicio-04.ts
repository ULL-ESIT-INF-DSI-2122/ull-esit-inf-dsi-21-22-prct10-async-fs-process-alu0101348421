import * as fs from 'fs';
import yargs from 'yargs';

/**
 * Clase singleton para el manejo de comandos de la terminal
 * @class
 */
export class Wrapper {
  /**
   * Instancia de la clase
   * @type {Wrapper}
   */
  private static instance: Wrapper;
  /**
   * Constructor privado
   */
  private constructor() {}
  /**
   * Método para la obtención de la instancia de la clase
   * @returns {Wrapper}
   */
  public static getInstance(): Wrapper {
    if (!Wrapper.instance) {
      Wrapper.instance = new Wrapper();
    }
    return Wrapper.instance;
  }

  /**
   * Función que comprueba si una ruta es un fichero
   * @param path Ruta del fichero
   * @param callback Función de callback
   */
  isFile(path: string, callback: (err: NodeJS.ErrnoException | null,
    isFile: boolean) => void): void {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        callback(null, false);
      } else {
        fs.stat(path, (statErr, stats) => {
          if (statErr) {
            callback(statErr, false);
          }
          callback(null, stats.isFile());
        });
      }
    });
  }

  /**
   * Comprueba si una ruta es un directorio
   * @param path Ruta del directorio
   * @param callback Función de callback
   */
  isDir(path: string, callback: (err: NodeJS.ErrnoException | null,
    isDirectory: boolean) => void): void {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        callback(null, false);
      } else {
        fs.stat(path, (statErr, stats) => {
          if (statErr) {
            callback(statErr, false);
          }
          callback(null, stats.isDirectory());
        });
      }
    });
  }

  /**
   * Función que crea un directorio
   * @param path Ruta del directorio
   * @param callback Función de callback
   */
  mkdir(path: string, callback: (err: NodeJS.ErrnoException | null) => void) {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err?.code === 'ENOENT') {
        fs.mkdir(path, (mkDirErr) => {
          callback(mkDirErr);
        });
      } else {
        callback(null);
      }
    });
  }

  /**
   * Función ls que lista los ficheros de un directorio
   * @param path Ruta del directorio
   * @param callback Función de callback
   */
  ls(path: string, callback: (err: NodeJS.ErrnoException | null,
      files: string[]) => void) {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        callback(err, []);
      } else {
        fs.readdir(path, (readDirErr, files) => {
          if (readDirErr) {
            callback(readDirErr, []);
          } else {
            callback(null, files);
          }
        });
      }
    });
  }

  /**
   * Función que lee el contenido de un fichero
   * @param path Ruta del fichero
   * @param callback Función de callback
   */
  readFile(path: string, callback: (err: NodeJS.ErrnoException | null,
      data: string) => void) {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        callback(err, '');
      } else {
        fs.readFile(path, 'utf8', (readFileErr, data) => {
          if (readFileErr) {
            callback(readFileErr, '');
          }
          callback(null, data);
        });
      }
    });
  }

  /**
   * Función que elimina un fichero o directorio
   * @param path Ruta del fichero o directorio
   * @param callback Función de callback
   */
  rm(path: string, callback: (err: NodeJS.ErrnoException | null) => void) {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err?.code === 'ENOENT') {
        callback(new Error('File not found'));
      } else if (err) {
        callback(err);
      } else if (fs.statSync(path).isFile()) {
        fs.unlink(path, (unlErr) => {
          if (unlErr) {
            callback(unlErr);
          } else {
            callback(null);
          }
        });
      } else {
        fs.rmdir(path, (rmErr) => {
          if (rmErr) {
            callback(rmErr);
          }
          callback(null);
        });
      }
    });
  }

  /**
   * Función que mueve un fichero
   * @param src Ruta del fichero
   * @param dest Ruta de destino
   * @param callback Función de callback
   */
  move(src: string, dest: string, callback: (err: NodeJS.ErrnoException | null)
      => void) {
    fs.access(src, fs.constants.F_OK, (err) => {
      if (err?.code === 'ENOENT') {
        callback(new Error('File not found'));
      } else if (err) {
        callback(err);
      } else {
        fs.access(dest, fs.constants.F_OK, (accessErr) => {
          if (accessErr?.code === 'ENOENT') {
            fs.rename(src, dest, (renameErr) => {
              if (renameErr) {
                callback(renameErr);
              } else {
                callback(null);
              }
            });
          } else {
            callback(new Error('File already exists'));
          }
        });
      }
    });
  }
}

/**
 * Manejo de la línea de comandos
 */
yargs
    .command({
      command: 'isFile',
      describe: 'Check if is a file',
      builder: {
        path: {
          describe: 'Path to check',
          demandOption: true,
          type: 'string',
        },
      },
      handler: (argv) => {
        const {path} = argv;
        Wrapper.getInstance().isFile(path as string, (err, isFile) => {
          if (err) {
            console.log(err);
          } else {
            console.log(isFile);
          }
        });
      },
    })
    .command({
      command: 'isDir',
      describe: 'Check if is a directory',
      builder: {
        path: {
          describe: 'Path to check',
          demandOption: true,
          type: 'string',
        },
      },
      handler: (argv) => {
        const {path} = argv;
        Wrapper.getInstance().isDir(path as string,
            (err, isDirectory) => {
              if (err) {
                console.log(err);
              } else {
                console.log(isDirectory);
              }
            });
      },
    })
    .command({
      command: 'mkdir',
      describe: 'Create a directory',
      builder: {
        path: {
          describe: 'Path to create',
          demandOption: true,
          type: 'string',
        },
      },
      handler: (argv) => {
        const {path} = argv;
        Wrapper.getInstance().mkdir(path as string, (err) => {
          if (err) {
            console.log(err);
          }
        });
      },
    })
    .command({
      command: 'ls',
      describe: 'List files in a directory',
      builder: {
        path: {
          describe: 'Path to list',
          demandOption: true,
          type: 'string',
        },
      },
      handler: (argv) => {
        const {path} = argv;
        Wrapper.getInstance().ls(path as string, (err, files) => {
          if (err) {
            console.log(err);
          } else {
            for (const file of files) {
              console.log(file);
            }
          }
        });
      },
    })
    .command({
      command: 'readFile',
      describe: 'Read a file',
      builder: {
        path: {
          describe: 'Path to read',
          demandOption: true,
          type: 'string',
        },
      },
      handler: (argv) => {
        const {path} = argv;
        Wrapper.getInstance().readFile(path as string, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
          }
        });
      },
    })
    .command({
      command: 'rm',
      describe: 'Remove a file or directory',
      builder: {
        path: {
          describe: 'Path to remove',
          demandOption: true,
          type: 'string',
        },
      },
      handler: (argv) => {
        const {path} = argv;
        Wrapper.getInstance().rm(path as string, (err) => {
          if (err) {
            console.log(err);
          }
        });
      },
    })
    .command({
      command: 'move',
      describe: 'Move a file or directory',
      builder: {
        src: {
          describe: 'Path to move',
          demandOption: true,
          type: 'string',
        },
        dest: {
          describe: 'Destination path',
          demandOption: true,
          type: 'string',
        },
      },
      handler: (argv) => {
        const {src, dest} = argv;
        Wrapper.getInstance().move(src as string, dest as string, (err) => {
          if (err) {
            console.log(err);
          }
        });
      },
    })
    .help();

yargs.parse();
